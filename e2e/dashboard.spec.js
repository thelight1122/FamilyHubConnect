import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('DashboardPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('bell icon click shows notification overlay', async ({ page }) => {
    await page.locator('button:has(span.material-symbols-outlined:text("notifications"))').first().click();
    await expect(page.getByText('Notifications')).toBeVisible();
  });

  test('bell icon click again closes overlay', async ({ page }) => {
    const bell = page.locator('button:has(span.material-symbols-outlined:text("notifications"))').first();
    await bell.click();
    await expect(page.getByText('Notifications')).toBeVisible();
    await bell.click();
    await expect(page.getByText('Notifications')).not.toBeVisible();
  });

  test('overlay close button hides overlay', async ({ page }) => {
    await page.locator('button:has(span.material-symbols-outlined:text("notifications"))').first().click();
    await expect(page.getByText('Notifications')).toBeVisible();
    await page.locator('button:has(span.material-symbols-outlined:text("close"))').click();
    await expect(page.getByText('Notifications')).not.toBeVisible();
  });

  test('Finance quick action navigates to finance', async ({ page }) => {
    await page.getByText('Finance').click();
    await page.waitForURL('**/finance');
    expect(page.url()).toContain('/finance');
  });

  test('Sports quick action navigates to sports', async ({ page }) => {
    await page.getByText('Sports').click();
    await page.waitForURL('**/sports');
    expect(page.url()).toContain('/sports');
  });

  test('Pet Hub quick action navigates to pets', async ({ page }) => {
    await page.getByText('Pet Hub').click();
    await page.waitForURL('**/more/pets');
    expect(page.url()).toContain('/more/pets');
  });

  test('Family Court quick action navigates to court', async ({ page }) => {
    await page.getByText('Family Court').click();
    await page.waitForURL('**/more/court');
    expect(page.url()).toContain('/more/court');
  });
});
