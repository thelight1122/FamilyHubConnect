import { createClient } from '@supabase/supabase-js';
import { localSupabaseEnv } from './supabaseEnv.js';
import { PARENT, CHILD, NEWCOMER } from './people.js';

// Starts every run from the same place: a parent and a child account with no
// family. Anything these two made in an earlier run is removed first.
export default async function globalSetup() {
  const { url, serviceRoleKey } = localSupabaseEnv();
  const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

  const { data: existing, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;

  // The newcomer only needs removing; they sign up during the run.
  const newcomer = existing.users.find((u) => u.email === NEWCOMER.email);
  if (newcomer) {
    const { error } = await admin.auth.admin.deleteUser(newcomer.id);
    if (error) throw error;
  }

  for (const person of [PARENT, CHILD]) {
    const user = existing.users.find((u) => u.email === person.email);
    if (user) {
      // Families this person created (cascades to members, chores and the rest).
      await admin.from('families').delete().eq('created_by', user.id);
      const { error } = await admin.auth.admin.deleteUser(user.id);
      if (error) throw error;
    }

    const { error: createError } = await admin.auth.admin.createUser({
      email: person.email,
      password: person.password,
      email_confirm: true,
      user_metadata: { display_name: person.name, family_role: person.role },
    });
    if (createError) throw createError;
  }
}
