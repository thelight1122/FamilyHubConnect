import { test, expect } from '@playwright/test';

test.describe('LoginPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders email and password inputs', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('submit with any credentials redirects to dashboard', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@family.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('"Forgot password?" button is visible', async ({ page }) => {
    await expect(page.getByText('Forgot password?')).toBeVisible();
  });

  test('"Create Family Account" starts with account and family setup', async ({ page }) => {
    await page.getByText('Create Family Account').click();
    await page.waitForURL('**/onboarding/setup');
    await expect(page.getByRole('heading', { name: 'Create Family Account' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Login' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Family Members' })).toBeVisible();
  });

  test('family setup collects members before invite decision', async ({ page }) => {
    await page.getByText('Create Family Account').click();
    await page.locator('input[placeholder="Enter your name"]').fill('Tracey');
    await page.locator('input[placeholder="you@example.com"]').fill('tracey@example.com');
    await page.locator('input[placeholder="Enter family name"]').fill('Test Family');
    await page.locator('input[placeholder="Family member name"]').fill('Alex');
    await page.locator('input[placeholder="Optional invite email"]').fill('alex@example.com');
    await page.getByRole('button', { name: /Continue to Family Values/i }).click();
    await page.waitForURL('**/onboarding/values');

    await page.getByRole('button', { name: /Next: Rules/i }).click();
    await page.waitForURL('**/onboarding/rules');
    await page.getByRole('button', { name: /Next: Invite Decision/i }).click();
    await page.waitForURL('**/onboarding/invite');

    await expect(page.getByRole('heading', { name: 'Send invites?' })).toBeVisible();
    await expect(page.getByText('alex@example.com - adult')).toBeVisible();
  });

  test('Google and Apple sign-in buttons are visible', async ({ page }) => {
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByText('Continue with Apple')).toBeVisible();
  });
});
