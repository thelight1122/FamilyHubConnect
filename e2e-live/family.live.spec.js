import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { localSupabaseEnv } from './supabaseEnv.js';
import { PARENT, CHILD } from './people.js';

// One family, end to end, with real sign-in and the real database rules.
// Tests run in order and build on each other.
test.describe.configure({ mode: 'serial' });

const { url, serviceRoleKey } = localSupabaseEnv();
const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

async function signIn(page, person) {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/login');
  await page.fill('input[type="email"]', person.email);
  await page.fill('input[type="password"]', person.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/);
}

async function userId(email) {
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
  return data.users.find((u) => u.email === email).id;
}

test('a wrong password is refused', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', PARENT.email);
  await page.fill('input[type="password"]', 'not-the-password');
  await page.click('button[type="submit"]');
  await expect(page.getByText('Invalid login credentials')).toBeVisible();
  await expect(page).toHaveURL(/login/);
});

test('parent creates the family, a chore and a reward', async ({ page }) => {
  await signIn(page, PARENT);
  await page.goto('/chores');

  await page.getByPlaceholder('Family name').fill('E2E Family');
  await page.getByPlaceholder('Your display name').fill(PARENT.name);
  await page.getByRole('button', { name: 'Create Family' }).click();
  await expect(page.getByText('Family created')).toBeVisible();

  await page.getByPlaceholder('New chore').fill('Feed the dog');
  await page.getByLabel('Chore points').fill('5');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Feed the dog' })).toBeVisible();

  await page.getByRole('button', { name: 'Rewards Store' }).click();
  await page.getByPlaceholder('New reward').fill('Movie night');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByText('Reward added')).toBeVisible();

  // The invite flow is not built yet, so the child joins through the admin API.
  const { data: family } = await admin.from('families').select('id').eq('name', 'E2E Family').single();
  const { error } = await admin.from('family_members').insert({
    family_id: family.id,
    user_id: await userId(CHILD.email),
    role: 'child',
    display_name: CHILD.name,
  });
  expect(error).toBeNull();
});

test('child sees the chores, completes one, and cannot add chores', async ({ page }) => {
  await signIn(page, CHILD);
  await page.goto('/chores');

  await expect(page.getByRole('heading', { name: 'Feed the dog' })).toBeVisible();
  await expect(page.getByPlaceholder('New chore')).toHaveCount(0);

  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByText('Chore completed')).toBeVisible();
  await expect(page.getByText('1/1 Done')).toBeVisible();
});

test('child requests a loan and the parent approves it', async ({ page }) => {
  await signIn(page, CHILD);
  await page.goto('/finance/loan');
  await expect(page.getByText('Prototype Toggle:')).toHaveCount(0);
  await page.getByPlaceholder('Describe the funding request...').fill('New bike pedals');
  await page.getByPlaceholder('0.00').fill('25');
  await page.getByRole('button', { name: /Submit Pitch/ }).click();
  await page.waitForURL(/loan\/confirmation/);

  await signIn(page, PARENT);
  await page.goto('/finance');
  await expect(page.getByRole('heading', { name: 'Family Bank' })).toBeVisible();
  await expect(page.getByText('New bike pedals')).toBeVisible();
  await page.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByText('Loan approved')).toBeVisible();

  await signIn(page, CHILD);
  await page.goto('/finance');
  await expect(page.getByRole('heading', { name: `${CHILD.name}'s Wallet` })).toBeVisible();
  await expect(page.getByText('$25.00').first()).toBeVisible();
});

test('parent sets the mission, child proposes an amendment, parent adopts it', async ({ page }) => {
  await signIn(page, PARENT);
  await page.goto('/more/constitution');
  await page.getByPlaceholder('Family mission').fill('We listen first.');
  await page.getByRole('button', { name: 'Save mission' }).click();
  await expect(page.getByText('We listen first.')).toBeVisible();

  await signIn(page, CHILD);
  await page.goto('/more/constitution');
  await expect(page.getByText('We listen first.')).toBeVisible();
  await expect(page.getByPlaceholder('Family mission')).toHaveCount(0);
  await page.getByRole('button', { name: /Propose Amendment/ }).click();
  await page.locator('textarea[placeholder*="proposed change"]').fill('Later bedtime on Fridays');
  await page.getByRole('button', { name: 'Submit Proposal' }).click();
  await expect(page.getByText('Later bedtime on Fridays')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Adopt' })).toHaveCount(0);

  await signIn(page, PARENT);
  await page.goto('/more/constitution');
  await page.getByRole('button', { name: 'Adopt' }).click();
  await expect(page.getByText('Amendment adopted')).toBeVisible();
});

test('an accountability question: each account stays private until everyone is heard', async ({ page }) => {
  await signIn(page, CHILD);
  await page.goto('/more/court');
  await page.getByPlaceholder(/What is the question about/).fill('The screen-time agreement');
  await page.getByLabel(PARENT.name).check();
  await page.getByRole('button', { name: 'Open question' }).click();
  await expect(page.getByText('Question opened')).toBeVisible();
  await page.getByPlaceholder(/Your account/).fill('I thought the limit was two hours.');
  await page.getByRole('button', { name: 'Give my account' }).click();
  await expect(page.getByText(/Others' accounts appear once everyone has been heard/)).toBeVisible();

  await signIn(page, PARENT);
  await page.goto('/more/court');
  await expect(page.getByRole('heading', { name: 'The screen-time agreement' })).toBeVisible();
  await expect(page.getByText('I thought the limit was two hours.')).toHaveCount(0);
  await page.getByPlaceholder(/Your account/).fill('I said one hour but never wrote it down.');
  await page.getByRole('button', { name: 'Give my account' }).click();
  await expect(page.getByText('I thought the limit was two hours.')).toBeVisible();

  await page.getByPlaceholder('The common ground you agreed').fill('Write the limit on the fridge.');
  await page.getByRole('button', { name: 'Record common ground' }).click();
  await expect(page.getByText('Write the limit on the fridge.')).toBeVisible();
});
