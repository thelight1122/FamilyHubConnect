import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';
import { NOT_LIVE, failed, fromError, type LiveResult } from './liveResult';

type Family = Pick<Tables<'families'>, 'id' | 'name' | 'created_by' | 'created_at'>;
type Member = Pick<Tables<'family_members'>, 'family_id' | 'user_id' | 'role' | 'display_name' | 'created_at'>;
type Membership = Pick<Tables<'family_members'>, 'family_id' | 'role' | 'display_name'> & { families: Family | null };
type Chore = Pick<Tables<'chores'>, 'id' | 'family_id' | 'title' | 'assigned_to' | 'points' | 'completed_at' | 'created_at'>;
type Reward = Pick<Tables<'rewards'>, 'id' | 'family_id' | 'title' | 'points' | 'created_at'>;

interface FamilyCoreState {
  family: Family | null;
  membership: Membership | null;
  members: Member[];
  chores: Chore[];
  rewards: Reward[];
}

const initialState: FamilyCoreState = {
  family: null,
  membership: null,
  members: [],
  chores: [],
  rewards: [],
};

export default function useFamilyCore() {
  const { currentUser, supabaseAuthEnabled } = useAuth();
  const [state, setState] = useState<FamilyCoreState>(initialState);
  const [isLoading, setIsLoading] = useState(supabaseAuthEnabled);
  const [error, setError] = useState<string | null>(null);

  const db = supabaseAuthEnabled && currentUser?.id ? supabase : null;
  const userId = currentUser?.id ?? null;
  const canUseLiveData = Boolean(db && userId);

  const loadFamily = useCallback(async () => {
    if (!db || !userId) {
      setState(initialState);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data: memberships, error: membershipError } = await db
      .from('family_members')
      .select('family_id, role, display_name, families(id, name, created_by, created_at)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1);

    if (membershipError) {
      setError(membershipError.message);
      setIsLoading(false);
      return;
    }

    const membership = memberships?.[0] ?? null;
    const family = membership?.families ?? null;

    if (!family) {
      setState(initialState);
      setIsLoading(false);
      return;
    }

    const [{ data: members, error: membersError }, { data: chores, error: choresError }, { data: rewards, error: rewardsError }] =
      await Promise.all([
        db
          .from('family_members')
          .select('family_id, user_id, role, display_name, created_at')
          .eq('family_id', family.id)
          .order('created_at', { ascending: true }),
        db
          .from('chores')
          .select('id, family_id, title, assigned_to, points, completed_at, created_at')
          .eq('family_id', family.id)
          .order('created_at', { ascending: false }),
        db
          .from('rewards')
          .select('id, family_id, title, points, created_at')
          .eq('family_id', family.id)
          .order('created_at', { ascending: false }),
      ]);

    const nextError = membersError ?? choresError ?? rewardsError;
    if (nextError) {
      setError(nextError.message);
      setIsLoading(false);
      return;
    }

    setState({
      family,
      membership,
      members: members ?? [],
      chores: chores ?? [],
      rewards: rewards ?? [],
    });
    setIsLoading(false);
  }, [db, userId]);

  useEffect(() => {
    Promise.resolve().then(loadFamily);
  }, [loadFamily]);

  const createFamily = useCallback(
    async ({ name, displayName }: { name: string; displayName: string }): Promise<LiveResult> => {
      if (!db || !userId) return NOT_LIVE;

      const familyName = name.trim();
      const memberName = displayName.trim();
      if (!familyName || !memberName) return failed('Family name and display name are required.');

      const { data: family, error: familyError } = await db
        .from('families')
        .insert({ name: familyName, created_by: userId })
        .select('id, name, created_by, created_at')
        .single();

      if (familyError) return fromError(familyError);

      const { error: memberError } = await db.from('family_members').insert({
        family_id: family.id,
        user_id: userId,
        // The creator is always the family's first adult; the database
        // rejects any other first member.
        role: 'adult',
        display_name: memberName,
      });

      if (memberError) return fromError(memberError);

      await loadFamily();
      return { ok: true };
    },
    [db, userId, loadFamily]
  );

  const addChore = useCallback(
    async ({ title, points }: { title: string; points: string | number }): Promise<LiveResult> => {
      if (!db) return NOT_LIVE;
      if (!state.family?.id) return failed('Create a family before adding chores.');

      const { error: insertError } = await db.from('chores').insert({
        family_id: state.family.id,
        title: title.trim(),
        points: Number(points) || 0,
      });

      if (insertError) return fromError(insertError);
      await loadFamily();
      return { ok: true };
    },
    [db, loadFamily, state.family]
  );

  const toggleChore = useCallback(
    async (chore: Pick<Chore, 'id' | 'completed_at'>): Promise<LiveResult> => {
      if (!db) return NOT_LIVE;
      // Children may only complete chores through this function; direct
      // updates to chores are adult-only.
      const { error: updateError } = await db.rpc('set_chore_completed', {
        target_chore_id: chore.id,
        completed: !chore.completed_at,
      });

      if (updateError) return fromError(updateError);
      await loadFamily();
      return { ok: true };
    },
    [db, loadFamily]
  );

  const addReward = useCallback(
    async ({ title, points }: { title: string; points: string | number }): Promise<LiveResult> => {
      if (!db) return NOT_LIVE;
      if (!state.family?.id) return failed('Create a family before adding rewards.');

      const { error: insertError } = await db.from('rewards').insert({
        family_id: state.family.id,
        title: title.trim(),
        points: Number(points) || 1,
      });

      if (insertError) return fromError(insertError);
      await loadFamily();
      return { ok: true };
    },
    [db, loadFamily, state.family]
  );

  return useMemo(
    () => ({
      ...state,
      canUseLiveData,
      isLoading,
      error,
      createFamily,
      addChore,
      toggleChore,
      addReward,
      reload: loadFamily,
    }),
    [addChore, addReward, canUseLiveData, createFamily, error, isLoading, loadFamily, state, toggleChore]
  );
}
