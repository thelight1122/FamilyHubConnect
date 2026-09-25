import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';

// Accountability sessions (docs/SPEC-ACCOUNTABILITY-REFRAME-2026-09-18.md).
// What a person can read is enforced by the database: their own account
// always, everyone's once all participants have been heard.
export default function useAccountability(familyId) {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const live = Boolean(supabase && familyId && currentUser?.id);

  const load = useCallback(async () => {
    if (!live) {
      setSessions([]);
      return;
    }

    const { data, error: loadError } = await supabase
      .from('accountability_sessions')
      .select('id, door, topic, status, opened_at, closed_at, common_ground, session_participants(user_id), session_accounts(user_id, body, created_at)')
      .eq('family_id', familyId)
      .order('opened_at', { ascending: false });

    if (loadError) {
      setError(loadError.message);
      return;
    }

    setError(null);
    setSessions(
      (data ?? []).map((session) => {
        const participantIds = session.session_participants.map((p) => p.user_id);
        const accounts = session.session_accounts ?? [];
        return {
          ...session,
          participantIds,
          accounts,
          isParticipant: participantIds.includes(currentUser.id),
          myAccount: accounts.find((a) => a.user_id === currentUser.id) ?? null,
          // Visible accounts exceed one only once everyone has been heard.
          everyoneHeard: accounts.length === participantIds.length,
        };
      })
    );
  }, [currentUser, familyId, live]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const afterWrite = useCallback(
    async ({ error: writeError }) => {
      if (writeError) return { ok: false, message: writeError.message };
      await load();
      return { ok: true };
    },
    [load]
  );

  const openSession = useCallback(
    ({ door, topic, participantIds }) =>
      supabase
        .rpc('open_accountability_session', {
          target_family_id: familyId,
          session_door: door,
          session_topic: topic.trim(),
          participant_ids: participantIds,
        })
        .then(afterWrite),
    [afterWrite, familyId]
  );

  const giveAccount = useCallback(
    (sessionId, body) =>
      supabase.from('session_accounts').insert({ session_id: sessionId, user_id: currentUser.id, body: body.trim() }).then(afterWrite),
    [afterWrite, currentUser]
  );

  const closeSession = useCallback(
    (sessionId, commonGround) =>
      supabase.rpc('close_accountability_session', { target_session_id: sessionId, agreed_common_ground: commonGround.trim() }).then(afterWrite),
    [afterWrite]
  );

  return useMemo(
    () => ({ sessions, live, error, openSession, giveAccount, closeSession, reload: load }),
    [closeSession, error, giveAccount, live, load, openSession, sessions]
  );
}
