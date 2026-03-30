import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('FamilyGovernancePage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/governance');
  });

  test('page renders Family Governance heading', async ({ page }) => {
    await expect(page.getByText('Family Governance')).toBeVisible();
  });

  test('"Resolution" tab is active by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Resolution' })).toHaveClass(/text-primary/);
    await expect(page.getByText('Active Mediation')).toBeVisible();
  });

  test('"Jury Pool" tab renders jury section', async ({ page }) => {
    await page.getByRole('button', { name: 'Jury Pool' }).click();
    await expect(page.getByText('The Jury Pool')).toBeVisible();
    await expect(page.getByText('Mom (Sarah)')).toBeVisible();
  });

  test('"Archive" tab renders archive section', async ({ page }) => {
    await page.getByRole('button', { name: 'Archive' }).click();
    await expect(page.getByText('Court Archive')).toBeVisible();
    await expect(page.getByText('The "Dirty Dishes" Dispute')).toBeVisible();
  });

  test('"Rule Book" tab renders rulebook section', async ({ page }) => {
    await page.getByRole('button', { name: 'Rule Book' }).click();
    await expect(page.getByText('Family Constitution')).toBeVisible();
    await expect(page.getByText('Open Rule Book')).toBeVisible();
  });

  test('"New Resolution Request" button navigates to appeal page', async ({ page }) => {
    await page.getByRole('button', { name: /New Resolution Request/i }).click();
    await page.waitForURL('**/more/appeal');
    expect(page.url()).toContain('/more/appeal');
  });

  test('"Open Rule Book" button navigates to constitution page', async ({ page }) => {
    await page.getByRole('button', { name: 'Rule Book' }).click();
    await page.getByRole('button', { name: 'Open Rule Book' }).click();
    await page.waitForURL('**/more/constitution');
    expect(page.url()).toContain('/more/constitution');
  });
});
