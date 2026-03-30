import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('LockerRoomPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/sports');
  });

  test('page renders Locker Room heading', async ({ page }) => {
    await expect(page.getByText('Locker Room')).toBeVisible();
  });

  test('shows empty team state when no teams added', async ({ page }) => {
    await expect(page.getByText('No teams yet')).toBeVisible();
  });

  test('"Add Team" button is visible', async ({ page }) => {
    await expect(page.getByText('Add Team')).toBeVisible();
  });

  test('Schedule section shows empty state', async ({ page }) => {
    await expect(page.getByText('No upcoming events.')).toBeVisible();
  });

  test('"Open Team Chat" button navigates to team chat', async ({ page }) => {
    await page.getByText('Open Team Chat').click();
    await page.waitForURL('**/sports/chat');
    expect(page.url()).toContain('/sports/chat');
  });
});
