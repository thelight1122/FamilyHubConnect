import { supabase } from './supabase';
import type { FamilyRole } from '../context/auth-context';

export interface OnboardingDraft {
  account?: { name?: string; email?: string };
  familyName?: string;
  members?: { name: string; email: string; role: FamilyRole }[];
  values?: string[];
  rules?: string[];
}

export interface CreatedInvite {
  name: string;
  role: FamilyRole;
  code: string;
}

export type FinishResult =
  | { ok: true; familyName: string; invites: CreatedInvite[] }
  | { ok: false; message: string; step: 'family' | 'constitution' | 'invites' };

// Turns the wizard's draft into the live family. Safe to run again after a
// failure: it reuses the family the person already has, only writes values
// and rules if the constitution has none yet, and skips people who already
// have a pending invite.
export async function finishOnboarding(draft: OnboardingDraft, userId: string, fallbackName: string): Promise<FinishResult> {
  if (!supabase) return { ok: false, step: 'family', message: 'Setup needs a live Supabase project.' };
  const db = supabase;

  // 1. The family: reuse the person's family, or create it with them as its first adult.
  const { data: existing, error: memberError } = await db
    .from('family_members')
    .select('family_id, role, families(name)')
    .eq('user_id', userId)
    .limit(1);
  if (memberError) return { ok: false, step: 'family', message: memberError.message };

  let familyId = existing?.[0]?.family_id ?? null;
  let familyName = existing?.[0]?.families?.name ?? draft.familyName ?? '';
  if (existing?.[0] && existing[0].role !== 'adult') {
    return { ok: false, step: 'family', message: 'You already belong to a family as a child; an adult there sets it up.' };
  }

  if (!familyId) {
    const name = draft.familyName?.trim();
    if (!name) return { ok: false, step: 'family', message: 'Give your family a name first.' };
    const { data: family, error } = await db.from('families').insert({ name, created_by: userId }).select('id, name').single();
    if (error) return { ok: false, step: 'family', message: error.message };
    const { error: joinError } = await db.from('family_members').insert({
      family_id: family.id,
      user_id: userId,
      role: 'adult',
      display_name: draft.account?.name?.trim() || fallbackName,
    });
    if (joinError) return { ok: false, step: 'family', message: joinError.message };
    familyId = family.id;
    familyName = family.name;
  }

  // 2. The constitution's starting values and rules, only if it has none yet.
  const [{ count: valueCount }, { count: ruleCount }] = await Promise.all([
    db.from('constitution_values').select('id', { count: 'exact', head: true }).eq('family_id', familyId),
    db.from('constitution_rules').select('id', { count: 'exact', head: true }).eq('family_id', familyId),
  ]);
  const values = (draft.values ?? []).map((v) => v.trim()).filter(Boolean);
  const rules = (draft.rules ?? []).map((r) => r.trim()).filter(Boolean);

  if (!valueCount && values.length) {
    const { error } = await db
      .from('constitution_values')
      .insert(values.map((title, position) => ({ family_id: familyId, title, position })));
    if (error) return { ok: false, step: 'constitution', message: error.message };
  }
  if (!ruleCount && rules.length) {
    const { error } = await db
      .from('constitution_rules')
      .insert(rules.map((body, position) => ({ family_id: familyId, body, position })));
    if (error) return { ok: false, step: 'constitution', message: error.message };
  }

  // 3. One invite per family member entered, skipping any already invited.
  const { data: pending, error: inviteListError } = await db
    .from('family_invites')
    .select('display_name, role, code')
    .eq('family_id', familyId)
    .is('accepted_at', null)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString());
  if (inviteListError) return { ok: false, step: 'invites', message: inviteListError.message };

  const invites: CreatedInvite[] = [];
  for (const member of draft.members ?? []) {
    const name = member.name.trim();
    if (!name) continue;
    const already = pending?.find((p) => p.display_name === name);
    if (already) {
      invites.push({ name, role: already.role as FamilyRole, code: already.code });
      continue;
    }
    const { data, error } = await db.rpc('create_family_invite', {
      target_family_id: familyId,
      invite_role: member.role,
      invite_name: name,
      invite_email: member.email.trim() || undefined,
    });
    if (error) return { ok: false, step: 'invites', message: `${name}: ${error.message}` };
    invites.push({ name, role: member.role, code: data.code });
  }

  return { ok: true, familyName, invites };
}
