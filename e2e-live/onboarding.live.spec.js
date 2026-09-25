import { test, expect } from '@playwright/test';
import { NEW_PARENT } from './people.js';

// A brand-new parent goes through the four-step wizard with real sign-up.
// Independent of family.live.spec.js: this person starts a separate family.
test('a new parent creates an account, a family, its constitution and invites through the wizard', async ({ page }) => {
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
  await page.getByRole('button', { name: 'Create Family Account' }).click();
  await page.waitForURL(/onboarding\/setup/);

  // Step 1: account, family and members.
  await page.getByPlaceholder('Enter your name').fill(NEW_PARENT.name);
  await page.getByPlaceholder('you@example.com').fill(NEW_PARENT.email);
  await page.getByPlaceholder('At least 8 characters').fill(NEW_PARENT.password);
  await page.getByPlaceholder('Enter family name').fill('Wizard Family');
  await page.getByPlaceholder('Family member name').fill('Alex');
  await page.getByRole('button', { name: 'child', exact: true }).click();
  await page.getByRole('button', { name: /Continue to Family Values/ }).click();
  await page.waitForURL(/onboarding\/values/);

  // Step 2: values, including a custom one.
  await page.getByRole('button', { name: /Add Custom Value/ }).click();
  await page.getByPlaceholder(/Your value/).fill('Generosity');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: /Next: Rules/ }).click();
  await page.waitForURL(/onboarding\/rules/);

  // Step 3: rules, including a custom one.
  await page.getByPlaceholder('Type a custom rule...').fill('Family dinner on Sundays');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: /Next: Invite Decision/ }).click();
  await page.waitForURL(/onboarding\/invite/);

  // Step 4: review and create.
  await expect(page.getByText('Generosity', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Create family' }).click();
  await expect(page.getByRole('heading', { name: 'Your family is ready' })).toBeVisible();
  await expect(page.getByTestId('invite-code-Alex')).toHaveText(/^[A-HJ-NP-Z2-9]{10}$/);
  const alexCode = await page.getByTestId('invite-code-Alex').textContent();

  // Run the last step again (as after a dropped connection): it reuses the
  // family and Alex's invite, and adds no duplicate values or rules.
  await page.reload();
  await page.getByRole('button', { name: 'Create family' }).click();
  await expect(page.getByRole('heading', { name: 'Your family is ready' })).toBeVisible();
  await expect(page.getByTestId('invite-code-Alex')).toHaveText(alexCode);
  await page.getByRole('button', { name: 'Go to your family' }).click();
  await page.waitForURL(/dashboard/);

  // The live constitution holds what the wizard collected.
  await page.goto('/more/constitution');
  for (const value of ['Kindness', 'Respect', 'Curiosity', 'Generosity']) {
    await expect(page.getByText(value, { exact: true })).toHaveCount(1);
  }
  for (const rule of ['No phones at dinner', 'Bedtime at 9 PM', 'Family dinner on Sundays']) {
    await expect(page.getByText(rule, { exact: true })).toHaveCount(1);
  }

  // Exactly one invite for Alex waits on the Family page.
  await page.goto('/more/family');
  await expect(page.getByRole('list', { name: 'Invites' }).getByRole('listitem').filter({ hasText: 'Alex' })).toHaveCount(1);

  // Finishing cleared the draft, so the wizard's last step starts over.
  await page.goto('/onboarding/invite');
  await expect(page.getByRole('link', { name: 'Set up your family' })).toBeVisible();
});
