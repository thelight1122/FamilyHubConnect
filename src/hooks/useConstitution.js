import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';

const emptyState = {
  mission: '',
  values: [],
  rules: [],
  amendments: [],
  signatures: [],
};

const result = (error) => (error ? { ok: false, message: error.message } : { ok: true });

export default function useConstitution(familyId) {
  const { currentUser } = useAuth();
  const [state, setState] = useState(emptyState);
  const [error, setError] = useState(null);
  const live = Boolean(supabase && familyId && currentUser?.id);

  const load = useCallback(async () => {
    if (!live) {
      setState(emptyState);
      return;
    }

    const [constitution, values, rules, amendments, signatures] = await Promise.all([
      supabase.from('family_constitution').select('mission').eq('family_id', familyId).maybeSingle(),
      supabase.from('constitution_values').select('id, title, description, position').eq('family_id', familyId).order('position'),
      supabase.from('constitution_rules').select('id, body, position').eq('family_id', familyId).order('position'),
      supabase
        .from('constitution_amendments')
        .select('id, proposed_by, proposal, rationale, status, created_at')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false }),
      supabase.from('constitution_signatures').select('user_id, signed_at').eq('family_id', familyId),
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
  }, [familyId, live]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const afterWrite = useCallback(
    async (response) => {
      if (!response.error) await load();
      return result(response.error);
    },
    [load]
  );

  const saveMission = useCallback(
    (mission) =>
      supabase
        .from('family_constitution')
        .upsert({ family_id: familyId, mission: mission.trim(), updated_by: currentUser.id, updated_at: new Date().toISOString() })
        .then(afterWrite),
    [afterWrite, currentUser, familyId]
  );

  const addValue = useCallback(
    (title) =>
      supabase
        .from('constitution_values')
        .insert({ family_id: familyId, title: title.trim(), position: state.values.length })
        .then(afterWrite),
    [afterWrite, familyId, state.values.length]
  );

  const addRule = useCallback(
    (body) =>
      supabase
        .from('constitution_rules')
        .insert({ family_id: familyId, body: body.trim(), position: state.rules.length })
        .then(afterWrite),
    [afterWrite, familyId, state.rules.length]
  );

  const proposeAmendment = useCallback(
    ({ proposal, rationale }) =>
      supabase
        .from('constitution_amendments')
        .insert({ family_id: familyId, proposed_by: currentUser.id, proposal: proposal.trim(), rationale: rationale.trim() })
        .then(afterWrite),
    [afterWrite, currentUser, familyId]
  );

  const decideAmendment = useCallback(
    (id, adopt) => supabase.rpc('decide_amendment', { target_amendment_id: id, adopt }).then(afterWrite),
    [afterWrite]
  );

  const sign = useCallback(
    () => supabase.from('constitution_signatures').insert({ family_id: familyId, user_id: currentUser.id }).then(afterWrite),
    [afterWrite, currentUser, familyId]
  );

  return useMemo(
    () => ({
      ...state,
      live,
      error,
      hasSigned: state.signatures.some((s) => s.user_id === currentUser?.id),
      saveMission,
      addValue,
      addRule,
      proposeAmendment,
      decideAmendment,
      sign,
    }),
    [addRule, addValue, currentUser, decideAmendment, error, live, proposeAmendment, saveMission, sign, state]
  );
}
