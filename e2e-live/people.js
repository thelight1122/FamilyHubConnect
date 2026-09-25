// Test accounts that exist only in the local Supabase stack.
export const PARENT = { email: 'parent.e2e@familyhub.test', password: 'parent-e2e-password', name: 'Parent', role: 'adult' };
export const CHILD = { email: 'child.e2e@familyhub.test', password: 'child-e2e-password', name: 'Kid', role: 'child' };
// Has no account before the run: signs up through an invite link.
export const NEWCOMER = { email: 'newcomer.e2e@familyhub.test', password: 'newcomer-e2e-password', name: 'Sam', role: 'adult' };
// Has no account before the run: creates one and a family through the setup wizard.
export const NEW_PARENT = { email: 'newparent.e2e@familyhub.test', password: 'newparent-e2e-password', name: 'Robin', role: 'adult' };
