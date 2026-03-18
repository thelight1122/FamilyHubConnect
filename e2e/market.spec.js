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

  test('Buy button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Buy/i }).click();
    await expect(page.getByText('Order placed — shares purchased!')).toBeVisible();
  });

  test('Sell button shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Sell/i }).click();
    await expect(page.getByText('Shares sold successfully!')).toBeVisible();
  });
});
