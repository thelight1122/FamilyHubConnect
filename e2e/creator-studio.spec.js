import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('CreatorStudioPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/creator');
  });

  test('page renders Creator Studio heading', async ({ page }) => {
    await expect(page.getByText('Creator Studio')).toBeVisible();
  });

  test('"Launch Maker" button shows "Creator tools coming soon!" toast', async ({ page }) => {
    await page.getByRole('button', { name: /Launch Maker/i }).click();
    await expect(page.getByText('Creator tools coming soon!')).toBeVisible();
  });

  test('"Create a New Story" button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Create a New Story/i }).click();
    await expect(page.getByText('Creator tools coming soon!')).toBeVisible();
  });

  test('"Play Now" button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Play Now/i }).click();
    await expect(page.getByText('Creator tools coming soon!')).toBeVisible();
  });

  test('"Open Canvas" button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Open Canvas/i }).click();
    await expect(page.getByText('Creator tools coming soon!')).toBeVisible();
  });

  test('"See Gallery" button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /See Gallery/i }).click();
    await expect(page.getByText('Creator tools coming soon!')).toBeVisible();
  });

  test('FAB "+" button shows toast', async ({ page }) => {
    // FAB is the fixed bottom-right add button
    await page.locator('button.fixed').click();
    await expect(page.getByText('Creator tools coming soon!')).toBeVisible();
  });
});
