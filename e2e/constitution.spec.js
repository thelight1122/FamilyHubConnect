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
    await expect(page.getByText('Kindness')).toBeVisible();
    await expect(page.getByText('Honesty')).toBeVisible();
    await expect(page.getByText('Curiosity')).toBeVisible();
  });

  test('Family Rules section is visible', async ({ page }) => {
    await expect(page.getByText('Family Rules')).toBeVisible();
    await expect(page.getByText('No phones at the dinner table.')).toBeVisible();
  });

  test('"Propose Amendment" button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Propose Amendment/i }).click();
    await expect(page.getByText('Amendment proposal submitted!')).toBeVisible();
  });
});
