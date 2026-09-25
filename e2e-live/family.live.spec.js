import { Buffer } from 'node:buffer';
import { test, expect } from '@playwright/test';
import { PARENT, CHILD, NEWCOMER } from './people.js';

// One family, end to end, with real sign-in and the real database rules.
// Tests run in order and build on each other.
test.describe.configure({ mode: 'serial' });

// Everything goes through the app, as real families use it: no admin or direct API calls.

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

// Creates an invite on the Family page (signed in as an adult) and returns its code.
async function createInvite(page, name, role, email = '') {
  await page.goto('/more/family');
  await page.getByPlaceholder('Their name').fill(name);
  await page.getByRole('radio', { name: role }).click();
  if (email) await page.getByPlaceholder(/Their email/).fill(email);
  await page.getByRole('button', { name: 'Create invite' }).click();
  const code = (await page.getByTestId('invite-code').textContent()).trim();
  expect(code).toMatch(/^[A-HJ-NP-Z2-9]{10}$/);
  return code;
}

let kidCode;

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

  kidCode = await createInvite(page, CHILD.name, 'child');
});

test('the child opens the invite link, signs in and joins', async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/join?code=${kidCode}`);
  await page.getByRole('link', { name: 'I already have an account' }).click();
  await page.fill('input[type="email"]', CHILD.email);
  await page.fill('input[type="password"]', CHILD.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/join\?code=/);
  await page.getByRole('button', { name: 'Accept invite' }).click();
  await expect(page.getByText(`Welcome to E2E Family, ${CHILD.name}!`)).toBeVisible();

  // The same code can't be used twice.
  await page.goto(`/join?code=${kidCode}`);
  await page.getByRole('button', { name: 'Accept invite' }).click();
  await expect(page.getByRole('alert')).toContainText('not valid');
});

test('a newcomer signs up from an email-locked invite and joins as an adult', async ({ page }) => {
  await signIn(page, PARENT);
  const code = await createInvite(page, NEWCOMER.name, 'adult', NEWCOMER.email);

  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/join?code=${code}`);
  await page.getByRole('link', { name: 'Create account' }).click();
  await page.getByPlaceholder('Your name').fill(NEWCOMER.name);
  await page.getByPlaceholder('Email').fill(NEWCOMER.email);
  await page.getByPlaceholder(/Password/).fill(NEWCOMER.password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL(/\/join\?code=/);
  await page.getByRole('button', { name: 'Accept invite' }).click();
  await expect(page.getByText(`Welcome to E2E Family, ${NEWCOMER.name}!`)).toBeVisible();
  await page.getByRole('button', { name: 'Go to your family' }).click();
  await page.waitForURL(/adult\/dashboard/);

  await page.goto('/more/family');
  await expect(page.getByText(`${NEWCOMER.name}(you)`)).toBeVisible();
  await expect(page.getByRole('list', { name: 'Invites' }).getByText('accepted').first()).toBeVisible();
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

// A 1x1 PNG for photo uploads.
const PNG = {
  name: 'photo.png',
  mimeType: 'image/png',
  buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
};

test('health: a child logs their own event; the parent sees it under the child, not their own', async ({ page }) => {
  await signIn(page, CHILD);
  await page.goto('/more/health');
  await page.getByRole('button', { name: /Add Log/ }).click();
  await page.getByRole('button', { name: 'Illness' }).click();
  await page.locator('textarea[placeholder*="symptoms"]').fill('Sore throat');
  await page.getByRole('button', { name: 'Save Log' }).click();
  await expect(page.getByText('Health event logged!')).toBeVisible();
  await expect(page.getByText('Sore throat')).toBeVisible();

  await signIn(page, PARENT);
  await page.goto('/more/health');
  await expect(page.getByText('Sore throat')).toHaveCount(0);
  await page.getByRole('button', { name: CHILD.name }).click();
  await expect(page.getByText('Sore throat')).toBeVisible();
});

test('pets: the parent adds a pet and the child logs a walk', async ({ page }) => {
  await signIn(page, PARENT);
  await page.goto('/more/pets');
  await page.getByPlaceholder('Pet name').fill('Rex');
  await page.getByPlaceholder('Species').fill('Dog');
  await page.getByRole('button', { name: 'Add pet' }).click();
  await expect(page.getByRole('heading', { name: 'Rex' })).toBeVisible();

  await signIn(page, CHILD);
  await page.goto('/more/pets');
  await expect(page.getByPlaceholder('Pet name')).toHaveCount(0);
  await page.getByRole('button', { name: 'Add Walk' }).click();
  await page.getByPlaceholder('km').fill('1.5');
  await page.getByRole('button', { name: 'Log walk' }).click();
  await expect(page.getByText('Walk logged')).toBeVisible();
  await expect(page.getByText(`${CHILD.name} · 20 min`)).toBeVisible();
});

test('timeline: a private journal stays with its author; shared moments reach the family', async ({ page }) => {
  await signIn(page, CHILD);
  await page.goto('/more/timeline');
  await page.getByRole('button', { name: 'Add a moment' }).click();
  await page.getByRole('button', { name: 'journal', exact: true }).click();
  await page.getByPlaceholder('Write your entry').fill('A private thought.');
  await page.getByLabel('Keep private').check();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Added to the timeline')).toBeVisible();

  await page.getByRole('button', { name: 'Add a moment' }).click();
  await page.getByRole('button', { name: 'achievement', exact: true }).click();
  await page.getByPlaceholder('Title').fill('Learned to swim');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Learned to swim')).toBeVisible();
  await expect(page.getByText('A private thought.')).toBeVisible();

  await signIn(page, PARENT);
  await page.goto('/more/timeline');
  await expect(page.getByText('Learned to swim')).toBeVisible();
  await expect(page.getByText('A private thought.')).toHaveCount(0);

  await page.getByRole('button', { name: 'Add a moment' }).click();
  await page.getByPlaceholder('Title').fill('Beach day');
  await page.getByLabel('Photo').setInputFiles(PNG);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Added to the timeline')).toBeVisible();
  await expect(page.locator('div[style*="family-media"]')).toHaveCount(1);
});

test('sports: the parent sets up a team, the child packs and chats', async ({ page }) => {
  await signIn(page, PARENT);
  await page.goto('/sports');
  await page.getByText('Add Team').click();
  await page.getByPlaceholder('Team name').fill('Tigers');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('heading', { name: 'Tigers' })).toBeVisible();
  await page.getByPlaceholder('Item', { exact: true }).fill('Shin guards');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByText('0 of 1 packed')).toBeVisible();

  await signIn(page, CHILD);
  await page.goto('/sports');
  await expect(page.getByPlaceholder('Team name')).toHaveCount(0);
  await page.getByText('Shin guards').click();
  await expect(page.getByText('1 of 1 packed')).toBeVisible();
  await page.getByText('Open Team Chat').click();
  // Wait for the chat and its team to load, as a person would see them, before typing.
  await page.waitForURL(/sports\/chat/);
  await expect(page.getByRole('heading', { name: 'Team Chat' })).toBeVisible();
  await expect(page.getByText('Tigers', { exact: true })).toBeVisible();
  await page.getByPlaceholder('Type a message to the team...').fill('Ready for practice!');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Ready for practice!')).toBeVisible();

  await signIn(page, PARENT);
  await page.goto('/sports/chat');
  await expect(page.getByText('Ready for practice!')).toBeVisible();
  await expect(page.getByText(CHILD.name, { exact: true })).toBeVisible();
});

test('creator studio: poll voting, a photo story and a recorded voice memo', async ({ page }) => {
  await signIn(page, PARENT);
  await page.goto('/more/creator');
  await page.getByText('Family Poll').click();
  await page.getByPlaceholder('Ask the family a question...').fill('Pizza or tacos?');
  await page.getByPlaceholder('Option 1').fill('Pizza');
  await page.getByPlaceholder('Option 2').fill('Tacos');
  await page.getByRole('button', { name: /Publish to Family/ }).click();
  await expect(page.getByText('Family Poll published successfully!')).toBeVisible();

  await page.getByText('Photo Story').first().click();
  await page.getByLabel('Photo').setInputFiles(PNG);
  await page.locator('textarea[placeholder*="caption"]').fill('Backyard science day');
  await page.getByRole('button', { name: /Publish to Family/ }).click();
  await expect(page.getByText('Photo Story published successfully!')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Backyard science day' })).toBeVisible();

  await page.getByText('Voice Memo', { exact: true }).first().click();
  await page.getByRole('button', { name: 'Start Recording' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Stop Recording' }).click();
  await page.getByRole('button', { name: /Publish to Family/ }).click();
  await expect(page.getByText('Voice Memo published successfully!')).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(1);

  // The child opens the studio, votes, and shares a poll of their own.
  await signIn(page, CHILD);
  await page.goto('/more/creator');
  await expect(page.getByRole('heading', { name: 'Library' }).or(page.getByText('Library'))).toBeVisible();
  await page.getByRole('button', { name: /Tacos/ }).click();
  await expect(page.getByText('Vote counted')).toBeVisible();
  await page.getByText('Family Poll').first().click();
  await page.getByPlaceholder('Ask the family a question...').fill('Movie tonight?');
  await page.getByPlaceholder('Option 1').fill('Yes');
  await page.getByPlaceholder('Option 2').fill('Tomorrow');
  await page.getByRole('button', { name: /Publish to Family/ }).click();
  await expect(page.getByText('Family Poll published successfully!')).toBeVisible();
  await expect(page.getByText(`Movie tonight?`)).toBeVisible();

  await signIn(page, PARENT);
  await page.goto('/more/creator');
  await expect(page.getByText(`${CHILD.name} · `, { exact: false }).first()).toBeVisible();
  await page.getByRole('button', { name: /Pizza/ }).click();
  await expect(page.getByText('Vote counted')).toBeVisible();
  await expect(page.getByRole('button', { name: /Tacos\s*1/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Pizza\s*1/ })).toBeVisible();
});

test('governance shows the closed question and the family circle', async ({ page }) => {
  await signIn(page, PARENT);
  await page.goto('/more/governance');
  await page.getByRole('button', { name: 'Archive' }).click();
  await expect(page.getByText('The screen-time agreement')).toBeVisible();
  await expect(page.getByText('"Write the limit on the fridge."')).toBeVisible();
  await page.getByRole('button', { name: 'Circle', exact: true }).click();
  await expect(page.getByText(CHILD.name, { exact: true })).toBeVisible();
});

test('maintenance: an item due soon is flagged, then handled', async ({ page }) => {
  await signIn(page, PARENT);
  await page.goto('/adult/maintenance');
  await page.getByPlaceholder('What needs doing').fill('Oil change');
  const soon = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  await page.getByLabel('Due date').fill(soon);
  await page.getByRole('button', { name: 'Add item' }).click();
  await expect(page.getByRole('heading', { name: 'Oil change' })).toBeVisible();
  await expect(page.locator('article').getByText('Due soon')).toBeVisible();
  await page.getByRole('button', { name: 'Mark handled' }).click();
  await expect(page.getByText('Marked handled')).toBeVisible();
  await expect(page.locator('article').getByText('Done')).toBeVisible();
});
