import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('TimelinePage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/timeline');
  });

  test('page renders Family Timeline heading', async ({ page }) => {
    await expect(page.getByText('Family Timeline')).toBeVisible();
  });

  test('"All" filter is active by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toHaveClass(/bg-primary/);
  });

  test('shows empty state for All filter when no entries', async ({ page }) => {
    await expect(page.getByText(/No All yet/)).toBeVisible();
  });

  test('"Achievements" filter click activates it and shows empty state', async ({ page }) => {
    await page.getByRole('button', { name: 'Achievements' }).click();
    await expect(page.getByRole('button', { name: 'Achievements' })).toHaveClass(/bg-primary/);
    await expect(page.getByText(/No Achievements yet/)).toBeVisible();
  });

  test('"Memories" filter click activates it', async ({ page }) => {
    await page.getByRole('button', { name: 'Memories' }).click();
    await expect(page.getByRole('button', { name: 'Memories' })).toHaveClass(/bg-primary/);
    await expect(page.getByText(/No Memories yet/)).toBeVisible();
  });

  test('"Journal" filter click activates it', async ({ page }) => {
    await page.getByRole('button', { name: 'Journal' }).click();
    await expect(page.getByRole('button', { name: 'Journal' })).toHaveClass(/bg-primary/);
    await expect(page.getByText(/No Journal yet/)).toBeVisible();
  });
});
