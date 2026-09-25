import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';
import { NOT_LIVE, fromError, type LiveResult } from './liveResult';

type Value = Pick<Tables<'constitution_values'>, 'id' | 'title' | 'description' | 'position'>;
type Rule = Pick<Tables<'constitution_rules'>, 'id' | 'body' | 'position'>;
type Amendment = Pick<Tables<'constitution_amendments'>, 'id' | 'proposed_by' | 'proposal' | 'rationale' | 'status' | 'created_at'>;
type Signature = Pick<Tables<'constitution_signatures'>, 'user_id' | 'signed_at'>;

interface ConstitutionState {
  mission: string;
  values: Value[];
  rules: Rule[];
  amendments: Amendment[];
  signatures: Signature[];
}

const emptyState: ConstitutionState = {
  mission: '',
  values: [],
  rules: [],
  amendments: [],
  signatures: [],
};

export default function useConstitution(familyId: string | undefined) {
  const { currentUser } = useAuth();
  const [state, setState] = useState<ConstitutionState>(emptyState);
  const [error, setError] = useState<string | null>(null);
  const userId = currentUser?.id ?? null;
  const db = familyId && userId ? supabase : null;
  const live = Boolean(db);

  const load = useCallback(async () => {
    if (!db || !familyId) {
      setState(emptyState);
      return;
    }

    const [constitution, values, rules, amendments, signatures] = await Promise.all([
      db.from('family_constitution').select('mission').eq('family_id', familyId).maybeSingle(),
      db.from('constitution_values').select('id, title, description, position').eq('family_id', familyId).order('position'),
      db.from('constitution_rules').select('id, body, position').eq('family_id', familyId).order('position'),
      db
        .from('constitution_amendments')
        .select('id, proposed_by, proposal, rationale, status, created_at')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false }),
      db.from('constitution_signatures').select('user_id, signed_at').eq('family_id', familyId),
    ]);

    const firstError = [constitution, values, rules, amendments, signatures].find((r) => r.error)?.error;
    if (firstError) {
      setError(firstError.message);
      return;
    }

    setError(null);
    setState({
      mission: constitution.data?.mission ?? '',
      values: values.data ?? [],
      rules: rules.data ?? [],
      amendments: amendments.data ?? [],
      signatures: signatures.data ?? [],
    });
  }, [db, familyId]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const afterWrite = useCallback(
    async ({ error: writeError }: { error: PostgrestError | null }): Promise<LiveResult> => {
      if (!writeError) await load();
      return fromError(writeError);
    },
    [load]
  );

  const saveMission = useCallback(
    async (mission: string): Promise<LiveResult> => {
      if (!db || !familyId || !userId) return NOT_LIVE;
      return afterWrite(
        await db
          .from('family_constitution')
          .upsert({ family_id: familyId, mission: mission.trim(), updated_by: userId, updated_at: new Date().toISOString() })
      );
    },
    [afterWrite, db, familyId, userId]
  );

  const addValue = useCallback(
    async (title: string): Promise<LiveResult> => {
      if (!db || !familyId) return NOT_LIVE;
      return afterWrite(
        await db.from('constitution_values').insert({ family_id: familyId, title: title.trim(), position: state.values.length })
      );
    },
    [afterWrite, db, familyId, state.values.length]
  );

  const addRule = useCallback(
    async (body: string): Promise<LiveResult> => {
      if (!db || !familyId) return NOT_LIVE;
      return afterWrite(
        await db.from('constitution_rules').insert({ family_id: familyId, body: body.trim(), position: state.rules.length })
      );
    },
    [afterWrite, db, familyId, state.rules.length]
  );

  const proposeAmendment = useCallback(
    async ({ proposal, rationale }: { proposal: string; rationale: string }): Promise<LiveResult> => {
      if (!db || !familyId || !userId) return NOT_LIVE;
      return afterWrite(
        await db
          .from('constitution_amendments')
          .insert({ family_id: familyId, proposed_by: userId, proposal: proposal.trim(), rationale: rationale.trim() })
      );
    },
    [afterWrite, db, familyId, userId]
  );

  const decideAmendment = useCallback(
    async (id: string, adopt: boolean): Promise<LiveResult> => {
      if (!db) return NOT_LIVE;
      return afterWrite(await db.rpc('decide_amendment', { target_amendment_id: id, adopt }));
    },
    [afterWrite, db]
  );

  const sign = useCallback(async (): Promise<LiveResult> => {
    if (!db || !familyId || !userId) return NOT_LIVE;
    return afterWrite(await db.from('constitution_signatures').insert({ family_id: familyId, user_id: userId }));
  }, [afterWrite, db, familyId, userId]);

  return useMemo(
    () => ({
      ...state,
      live,
      error,
      hasSigned: state.signatures.some((s) => s.user_id === userId),
      saveMission,
      addValue,
      addRule,
      proposeAmendment,
      decideAmendment,
      sign,
    }),
    [addRule, addValue, decideAmendment, error, live, proposeAmendment, saveMission, sign, state, userId]
  );
}
