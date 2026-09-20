import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('DashboardPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('bell icon click shows notification overlay', async ({ page }) => {
    await page.locator('button:has(span.material-symbols-outlined:text("notifications"))').first().click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  });

  test('overlay backdrop closes notifications', async ({ page }) => {
    const bell = page.locator('button:has(span.material-symbols-outlined:text("notifications"))').first();
    await bell.click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    await page.locator('.fixed.inset-0 .absolute.inset-0').click({ position: { x: 10, y: 10 } });
    await expect(page.getByRole('heading', { name: 'Notifications' })).not.toBeVisible();
  });

  test('overlay close button hides overlay', async ({ page }) => {
    await page.locator('button:has(span.material-symbols-outlined:text("notifications"))').first().click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    await page.locator('button:has(span.material-symbols-outlined:text("close"))').click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).not.toBeVisible();
  });

  test('Finance quick action navigates to finance', async ({ page }) => {
    await page.getByRole('button', { name: /account_balance_wallet Finance/i }).first().click();
    await page.waitForURL('**/finance');
    expect(page.url()).toContain('/finance');
  });

  test('Sports quick action navigates to sports', async ({ page }) => {
    await page.getByRole('button', { name: /sports_soccer Sports/i }).first().click();
    await page.waitForURL('**/sports');
    expect(page.url()).toContain('/sports');
  });

  test('Pet Hub quick action navigates to pets', async ({ page }) => {
    await page.getByRole('button', { name: /pets Pet Hub/i }).click();
    await page.waitForURL('**/more/pets');
    expect(page.url()).toContain('/more/pets');
  });

  test('Reflection quick action navigates to accountability', async ({ page }) => {
    await page.getByRole('button', { name: /balance Reflection Request/i }).click();
    await page.waitForURL('**/more/appeal');
    expect(page.url()).toContain('/more/appeal');
  });
});
