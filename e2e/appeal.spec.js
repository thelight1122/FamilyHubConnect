import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('AppealPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/appeal');
  });

  test('page renders Submit Reflection heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Submit Reflection' })).toBeVisible();
  });

  test('reason textarea accepts text', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="Share what happened"]');
    await textarea.fill('I was helping a friend.');
    await expect(textarea).toHaveValue('I was helping a friend.');
  });

  test('alternative input accepts text', async ({ page }) => {
    const input = page.locator('input[placeholder*="Repair task"]');
    await input.fill('Extra chore instead');
    await expect(input).toHaveValue('Extra chore instead');
  });

  test('learned textarea accepts text', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="Reflect"]');
    await textarea.fill('I should communicate better.');
    await expect(textarea).toHaveValue('I should communicate better.');
  });

  test('Submit button is disabled when reason is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Submit Reflection/i })).toBeDisabled();
  });

  test('Submit button is enabled after filling reason', async ({ page }) => {
    await page.locator('textarea[placeholder*="Share what happened"]').fill('My reason');
    await expect(page.getByRole('button', { name: /Submit Reflection/i })).toBeEnabled();
  });

  test('Submit shows success screen and hides form', async ({ page }) => {
    await page.locator('textarea[placeholder*="Share what happened"]').fill('My reason');
    await page.getByRole('button', { name: /Submit Reflection/i }).click();
    await expect(page.getByText('Reflection Submitted!')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Share what happened"]')).not.toBeVisible();
  });

  test('"Back to More" on success navigates to /more', async ({ page }) => {
    await page.locator('textarea[placeholder*="Share what happened"]').fill('My reason');
    await page.getByRole('button', { name: /Submit Reflection/i }).click();
    await page.getByRole('button', { name: /Back to More/i }).click();
    await page.waitForURL('**/more');
    expect(page.url()).toContain('/more');
  });
});
