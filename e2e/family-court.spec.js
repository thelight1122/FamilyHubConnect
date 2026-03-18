import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('FamilyCourtPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/court');
  });

  test('page renders Family Court heading', async ({ page }) => {
    await expect(page.getByText('Family Court')).toBeVisible();
  });

  test('Active Consequences section is visible', async ({ page }) => {
    await expect(page.getByText('Active Consequences')).toBeVisible();
    await expect(page.getByText('1-day screen time ban')).toBeVisible();
    await expect(page.getByText('Extra Chore: Kitchen')).toBeVisible();
  });

  test('"Mark Done" button triggers toast and marks consequence complete', async ({ page }) => {
    await page.getByRole('button', { name: /Mark Done/i }).click();
    await expect(page.getByText('Consequence marked complete')).toBeVisible();
    // The item that was pending should now show "Completed"
    await expect(page.getByText('Just now')).toBeVisible();
  });

  test('completed consequence shows "Completed" status', async ({ page }) => {
    await expect(page.getByText('Completed').first()).toBeVisible();
  });

  test('completed consequence does not show "Mark Done" button', async ({ page }) => {
    // The "No Gaming: Weekend" item has status completed — verify no second Mark Done button
    // After clicking the first Mark Done (there's only 1 initially), count
    const markDoneButtons = page.getByRole('button', { name: /Mark Done/i });
    await expect(markDoneButtons).toHaveCount(1);
  });

  test('Consequence History section is visible', async ({ page }) => {
    await expect(page.getByText('Consequence History')).toBeVisible();
    await expect(page.getByText('Earlier Bedtime (8PM)')).toBeVisible();
  });
});
