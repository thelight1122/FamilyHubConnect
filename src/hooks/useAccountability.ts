import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';
import { NOT_LIVE, fromError, type LiveResult } from './liveResult';

export type Door = 'support' | 'accountability';
type Account = Pick<Tables<'session_accounts'>, 'user_id' | 'body' | 'created_at'>;

export interface AccountabilitySession
  extends Pick<Tables<'accountability_sessions'>, 'id' | 'door' | 'topic' | 'status' | 'opened_at' | 'closed_at' | 'common_ground'> {
  participantIds: string[];
  accounts: Account[];
  isParticipant: boolean;
  myAccount: Account | null;
  everyoneHeard: boolean;
}

// Accountability sessions (docs/SPEC-ACCOUNTABILITY-REFRAME-2026-09-18.md).
// What a person can read is enforced by the database: their own account
// always, everyone's once all participants have been heard.
export default function useAccountability(familyId: string | undefined) {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<AccountabilitySession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = currentUser?.id ?? null;
  const db = familyId && userId ? supabase : null;
  const live = Boolean(db);

  const load = useCallback(async () => {
    if (!db || !familyId) {
      setSessions([]);
      return;
    }

    const { data, error: loadError } = await db
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
      (data ?? []).map(({ session_participants: participants, session_accounts: accounts, ...session }) => {
        const participantIds = participants.map((p) => p.user_id);
        return {
          ...session,
          participantIds,
          accounts,
          isParticipant: participantIds.includes(userId ?? ''),
          myAccount: accounts.find((a) => a.user_id === userId) ?? null,
          // Visible accounts exceed one only once everyone has been heard.
          everyoneHeard: accounts.length === participantIds.length,
        };
      })
    );
  }, [db, familyId, userId]);

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

  const openSession = useCallback(
    async ({ door, topic, participantIds }: { door: Door; topic: string; participantIds: string[] }): Promise<LiveResult> => {
      if (!db || !familyId) return NOT_LIVE;
      return afterWrite(
        await db.rpc('open_accountability_session', {
          target_family_id: familyId,
          session_door: door,
          session_topic: topic.trim(),
          participant_ids: participantIds,
        })
      );
    },
    [afterWrite, db, familyId]
  );

  const giveAccount = useCallback(
    async (sessionId: string, body: string): Promise<LiveResult> => {
      if (!db || !userId) return NOT_LIVE;
      return afterWrite(await db.from('session_accounts').insert({ session_id: sessionId, user_id: userId, body: body.trim() }));
    },
    [afterWrite, db, userId]
  );

  const closeSession = useCallback(
    async (sessionId: string, commonGround: string): Promise<LiveResult> => {
      if (!db) return NOT_LIVE;
      return afterWrite(
        await db.rpc('close_accountability_session', { target_session_id: sessionId, agreed_common_ground: commonGround.trim() })
      );
    },
    [afterWrite, db]
  );

  return useMemo(
    () => ({ sessions, live, error, openSession, giveAccount, closeSession, reload: load }),
    [closeSession, error, giveAccount, live, load, openSession, sessions]
  );
}
