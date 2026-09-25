import { useCallback, useEffect, useRef, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import useAuth from '../context/useAuth';
import { supabase, type FamilyDatabase } from '../lib/supabase';
import { NOT_LIVE, fromError, type LiveResult } from './liveResult';

type Loader<T> = (db: FamilyDatabase, familyId: string, userId: string) => PromiseLike<{ data: T; error: PostgrestError | null }>;

// Loads one family's data for a page and reloads it after each write.
// `empty` is shown when there is no signed-in family (prototype mode).
export default function useLiveQuery<T>(familyId: string | undefined, empty: NoInfer<T>, loader: Loader<T>) {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? null;
  const db = familyId && userId ? supabase : null;
  const [data, setData] = useState<T>(empty);
  const [error, setError] = useState<string | null>(null);

  // Hooks pass the loader and empty value inline, so their identity changes
  // every render. Keep the latest in a ref; only the family and user decide
  // when to reload.
  const latest = useRef({ empty, loader });
  useEffect(() => {
    latest.current = { empty, loader };
  });

  const load = useCallback(async () => {
    if (!db || !familyId || !userId) {
      setData(latest.current.empty);
      return;
    }
    const result = await latest.current.loader(db, familyId, userId);
    setError(result.error?.message ?? null);
    if (!result.error) setData(result.data);
  }, [db, familyId, userId]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  // Runs a write against the live database, then reloads.
  const write = useCallback(
    async (run: (db: FamilyDatabase, familyId: string, userId: string) => PromiseLike<{ error: PostgrestError | null }>): Promise<LiveResult> => {
      if (!db || !familyId || !userId) return NOT_LIVE;
      const { error: writeError } = await run(db, familyId, userId);
      if (!writeError) await load();
      return fromError(writeError);
    },
    [db, familyId, load, userId]
  );

  return { data, error, live: Boolean(db), userId, reload: load, write };
}

// Combines several query results into one { data, error } for a loader.
export function combine<T extends Record<string, { data: unknown; error: PostgrestError | null }>>(
  results: T
): { data: { [K in keyof T]: NonNullable<T[K]['data']> }; error: PostgrestError | null } {
  const error = Object.values(results).find((r) => r.error)?.error ?? null;
  const data = Object.fromEntries(Object.entries(results).map(([key, r]) => [key, r.data ?? []])) as {
    [K in keyof T]: NonNullable<T[K]['data']>;
  };
  return { data, error };
}
