import useLiveQuery from './useLiveQuery';
import { failed, type LiveResult } from './liveResult';
import type { FamilyRole } from '../context/auth-context';
import { supabase } from '../lib/supabase';

export type InviteState = 'pending' | 'accepted' | 'revoked' | 'expired';

export function inviteState(invite: { accepted_at: string | null; revoked_at: string | null; expires_at: string }): InviteState {
  if (invite.accepted_at) return 'accepted';
  if (invite.revoked_at) return 'revoked';
  if (new Date(invite.expires_at).getTime() < Date.now()) return 'expired';
  return 'pending';
}

export const inviteLink = (code: string) => `${window.location.origin}/join?code=${code}`;

// Invites are visible only to the family's adults (the database decides).
export default function useInvites(familyId: string | undefined) {
  const query = useLiveQuery(familyId, [], (db, fid) =>
    db
      .from('family_invites')
      .select('id, code, role, display_name, email, created_at, expires_at, accepted_at, revoked_at')
      .eq('family_id', fid)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => ({ data: data ?? [], error }))
  );

  const createInvite = async (details: { role: FamilyRole; displayName: string; email: string }): Promise<LiveResult & { code?: string }> => {
    if (!familyId || !supabase) return failed('Create a family first.');
    const { data, error } = await supabase.rpc('create_family_invite', {
      target_family_id: familyId,
      invite_role: details.role,
      invite_name: details.displayName,
      invite_email: details.email.trim() || undefined,
    });
    if (error) return failed(error.message);
    await query.reload();
    return { ok: true, code: data.code };
  };

  return {
    invites: query.data,
    live: query.live,
    error: query.error,
    createInvite,
    revokeInvite: (id: string) => query.write((db) => db.from('family_invites').update({ revoked_at: new Date().toISOString() }).eq('id', id)),
    removeMember: (userId: string) => query.write((db, fid) => db.from('family_members').delete().eq('family_id', fid).eq('user_id', userId)),
  };
}

// Accepting doesn't need a family yet, so it lives outside the hook.
export async function acceptInvite(code: string): Promise<
  { ok: true; familyName: string; role: FamilyRole; displayName: string } | { ok: false; message: string }
> {
  if (!supabase) return { ok: false, message: 'Invites need a live Supabase project.' };
  const { data, error } = await supabase.rpc('accept_family_invite', { invite_code: code });
  if (error) return { ok: false, message: error.message };
  const result = data as { ok: boolean; message?: string; family_name?: string; role?: FamilyRole; display_name?: string };
  if (!result.ok) return { ok: false, message: result.message ?? 'The invite could not be accepted.' };
  return { ok: true, familyName: result.family_name ?? '', role: result.role ?? 'child', displayName: result.display_name ?? '' };
}
