import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('FinancePage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/finance');
  });

  test('page renders Family Finance heading', async ({ page }) => {
    await expect(page.getByText("Leo's Wallet")).toBeVisible();
  });

  test('bank settings gives explicit local-preview feedback', async ({ page }) => {
    await page.getByRole('button', { name: 'Parent View' }).click();
    await page.getByRole('button', { name: 'Bank settings' }).click();
    await expect(page.getByText('Bank settings are not enabled for this local preview.')).toBeVisible();
  });

  test('Request Funds tile navigates to loan page', async ({ page }) => {
    await page.getByText('Request Funds').click();
    await page.waitForURL('**/finance/loan');
    expect(page.url()).toContain('/finance/loan');
  });

  test('Market Simulator tile navigates to market page', async ({ page }) => {
    await page.goto('/finance');
    await page.getByText('Market Sim').click();
    await page.waitForURL('**/finance/market');
    expect(page.url()).toContain('/finance/market');
  });

  test('empty transactions state is visible', async ({ page }) => {
    await expect(page.getByText('No transactions yet')).toBeVisible();
  });

  test('shows savings goal section', async ({ page }) => {
    await expect(page.getByText('Active Savings Goal')).toBeVisible();
  });
});
