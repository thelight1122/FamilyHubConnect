import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('ConstitutionPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/constitution');
  });

  test('page renders Family Constitution heading', async ({ page }) => {
    await expect(page.getByText('Family Constitution')).toBeVisible();
  });

  test('Core Values section renders values', async ({ page }) => {
    await expect(page.getByText('Our Core Values')).toBeVisible();
    await expect(page.getByText('No live values entered')).toBeVisible();
  });

  test('Family Rules section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Family Rules' })).toBeVisible();
    await expect(page.getByText('No live family rules entered.')).toBeVisible();
  });

  test('"Propose Amendment" button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Propose Amendment/i }).click();
    await page.locator('textarea[placeholder*="proposed change"]').fill('Add a weekly family reflection check-in.');
    await page.getByRole('button', { name: 'Submit Proposal' }).click();
    await expect(page.getByText('Amendment proposal submitted!')).toBeVisible();
  });
});
