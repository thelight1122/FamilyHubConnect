import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';

const initialState = {
  family: null,
  membership: null,
  members: [],
  chores: [],
  rewards: [],
};

export default function useFamilyCore() {
  const { currentUser, supabaseAuthEnabled } = useAuth();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(supabaseAuthEnabled);
  const [error, setError] = useState(null);

  const canUseLiveData = Boolean(supabaseAuthEnabled && supabase && currentUser?.id);

  const loadFamily = useCallback(async () => {
    if (!canUseLiveData) {
      setState(initialState);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data: memberships, error: membershipError } = await supabase
      .from('family_members')
      .select('family_id, role, display_name, families(id, name, created_by, created_at)')
      .eq('user_id', currentUser.id)
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
        supabase
          .from('family_members')
          .select('family_id, user_id, role, display_name, created_at')
          .eq('family_id', family.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('chores')
          .select('id, family_id, title, assigned_to, points, completed_at, created_at')
          .eq('family_id', family.id)
          .order('created_at', { ascending: false }),
        supabase
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
  }, [canUseLiveData, currentUser]);

  useEffect(() => {
    Promise.resolve().then(loadFamily);
  }, [loadFamily]);

  const createFamily = useCallback(
    async ({ name, displayName }) => {
      if (!canUseLiveData) return { ok: false, message: 'Live family data requires Supabase sign-in.' };

      const familyName = name.trim();
      const memberName = displayName.trim();
      if (!familyName || !memberName) return { ok: false, message: 'Family name and display name are required.' };

      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({ name: familyName, created_by: currentUser.id })
        .select('id, name, created_by, created_at')
        .single();

      if (familyError) return { ok: false, message: familyError.message };

      const { error: memberError } = await supabase.from('family_members').insert({
        family_id: family.id,
        user_id: currentUser.id,
        // The creator is always the family's first adult; the database
        // rejects any other first member.
        role: 'adult',
        display_name: memberName,
      });

      if (memberError) return { ok: false, message: memberError.message };

      await loadFamily();
      return { ok: true };
    },
    [canUseLiveData, currentUser, loadFamily]
  );

  const addChore = useCallback(
    async ({ title, points }) => {
      if (!state.family?.id) return { ok: false, message: 'Create a family before adding chores.' };

      const { error: insertError } = await supabase.from('chores').insert({
        family_id: state.family.id,
        title: title.trim(),
        points: Number(points) || 0,
      });

      if (insertError) return { ok: false, message: insertError.message };
      await loadFamily();
      return { ok: true };
    },
    [loadFamily, state.family]
  );

  const toggleChore = useCallback(
    async (chore) => {
      // Children may only complete chores through this function; direct
      // updates to chores are adult-only.
      const { error: updateError } = await supabase.rpc('set_chore_completed', {
        target_chore_id: chore.id,
        completed: !chore.completed_at,
      });

      if (updateError) return { ok: false, message: updateError.message };
      await loadFamily();
      return { ok: true };
    },
    [loadFamily]
  );

  const addReward = useCallback(
    async ({ title, points }) => {
      if (!state.family?.id) return { ok: false, message: 'Create a family before adding rewards.' };

      const { error: insertError } = await supabase.from('rewards').insert({
        family_id: state.family.id,
        title: title.trim(),
        points: Number(points) || 1,
      });

      if (insertError) return { ok: false, message: insertError.message };
      await loadFamily();
      return { ok: true };
    },
    [loadFamily, state.family]
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
