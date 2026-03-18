import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('AppealPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/appeal');
  });

  test('page renders Submit Appeal heading', async ({ page }) => {
    await expect(page.getByText('Submit Appeal')).toBeVisible();
  });

  test('reason textarea accepts text', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="side of the story"]');
    await textarea.fill('I was helping a friend.');
    await expect(textarea).toHaveValue('I was helping a friend.');
  });

  test('alternative input accepts text', async ({ page }) => {
    const input = page.locator('input[placeholder*="chore"]');
    await input.fill('Extra chore instead');
    await expect(input).toHaveValue('Extra chore instead');
  });

  test('learned textarea accepts text', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="Reflect"]');
    await textarea.fill('I should communicate better.');
    await expect(textarea).toHaveValue('I should communicate better.');
  });

  test('Submit button is disabled when reason is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Submit Appeal/i })).toBeDisabled();
  });

  test('Submit button is enabled after filling reason', async ({ page }) => {
    await page.locator('textarea[placeholder*="side of the story"]').fill('My reason');
    await expect(page.getByRole('button', { name: /Submit Appeal/i })).toBeEnabled();
  });

  test('Submit shows success screen and hides form', async ({ page }) => {
    await page.locator('textarea[placeholder*="side of the story"]').fill('My reason');
    await page.getByRole('button', { name: /Submit Appeal/i }).click();
    await expect(page.getByText('Appeal Submitted!')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="side of the story"]')).not.toBeVisible();
  });

  test('"Back to More" on success navigates to /more', async ({ page }) => {
    await page.locator('textarea[placeholder*="side of the story"]').fill('My reason');
    await page.getByRole('button', { name: /Submit Appeal/i }).click();
    await page.getByRole('button', { name: /Back to More/i }).click();
    await page.waitForURL('**/more');
    expect(page.url()).toContain('/more');
  });
});
