import type { PostgrestError } from '@supabase/supabase-js';

// What every live write returns to a page: ok, or a message to show.
export type LiveResult = { ok: true } | { ok: false; message: string };

export const failed = (message: string): LiveResult => ({ ok: false, message });

export const fromError = (error: PostgrestError | null): LiveResult =>
  error ? { ok: false, message: error.message } : { ok: true };

// Reported when a page calls a live write without a signed-in family.
export const NOT_LIVE: LiveResult = { ok: false, message: 'Live family data requires Supabase sign-in.' };
