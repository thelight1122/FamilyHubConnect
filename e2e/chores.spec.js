import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('ChoresPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/chores');
  });

  test('"My Tasks" tab is active by default', async ({ page }) => {
    const tasksTab = page.getByRole('button', { name: 'My Tasks' });
    await expect(tasksTab).toHaveClass(/bg-white/);
  });

  test('"Rewards Store" tab click switches content', async ({ page }) => {
    await page.getByRole('button', { name: 'Rewards Store' }).click();
    await expect(page.getByText('Rewards Store').last()).toBeVisible();
  });

  test('tasks tab shows empty state when no tasks', async ({ page }) => {
    await expect(page.getByText('No live chores entered')).toBeVisible();
  });

  test('rewards tab shows empty state when no rewards', async ({ page }) => {
    await page.getByRole('button', { name: 'Rewards Store' }).click();
    await expect(page.getByText('No live rewards entered')).toBeVisible();
  });

  test('progress counter shows 0/0', async ({ page }) => {
    await expect(page.getByText('0/0 Done')).toBeVisible();
  });
});
