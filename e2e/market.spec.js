import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('MarketPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/finance/market');
  });

  test('page renders Market Simulator heading', async ({ page }) => {
    await expect(page.getByText('Market Simulator')).toBeVisible();
  });

  test('empty positions state is visible', async ({ page }) => {
    await expect(page.getByText('No positions yet')).toBeVisible();
  });

  test('cash balance is visible without positions', async ({ page }) => {
    await expect(page.getByText('Cash Balance')).toBeVisible();
    await expect(page.getByText('$500.00').nth(1)).toBeVisible();
  });
});
