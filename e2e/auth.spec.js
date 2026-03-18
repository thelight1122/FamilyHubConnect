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

  test('"Create Family Account" navigates to onboarding values', async ({ page }) => {
    await page.getByText('Create Family Account').click();
    await page.waitForURL('**/onboarding/values');
    expect(page.url()).toContain('/onboarding/values');
  });

  test('Google and Apple sign-in buttons are visible', async ({ page }) => {
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByText('Continue with Apple')).toBeVisible();
  });
});
