import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('MorePage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more');
  });

  test('profile settings gives explicit local feedback', async ({ page }) => {
    await page.getByRole('button', { name: /Profile Settings/i }).click();
    await expect(page.getByText('Profile settings are managed by the family account owner.')).toBeVisible();
  });

  test('notifications gives explicit local-preview feedback', async ({ page }) => {
    await page.getByRole('button', { name: /Notifications/i }).click();
    await expect(page.getByText('Notifications are not enabled for this local preview.')).toBeVisible();
  });

  test('header settings and profile actions give local feedback', async ({ page }) => {
    await page.getByRole('button', { name: 'More settings' }).click();
    await expect(page.getByText('More settings are not enabled for this local preview.')).toBeVisible();
    await page.getByRole('button', { name: 'View Profile' }).click();
    await expect(page.getByText('Family profile editing is not enabled for this local preview.')).toBeVisible();
  });
});
