import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('FinancePage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/finance');
  });

  test('page renders Family Finance heading', async ({ page }) => {
    await expect(page.getByText('Family Finance')).toBeVisible();
  });

  test('Family Bank tile navigates to loan page', async ({ page }) => {
    await page.getByText('Family Bank').click();
    await page.waitForURL('**/finance/loan');
    expect(page.url()).toContain('/finance/loan');
  });

  test('Market Simulator tile navigates to market page', async ({ page }) => {
    await page.goto('/finance');
    await page.getByText('Market Simulator').click();
    await page.waitForURL('**/finance/market');
    expect(page.url()).toContain('/finance/market');
  });

  test('positive transaction amounts shown with + prefix', async ({ page }) => {
    await expect(page.getByText('+$20.00')).toBeVisible();
  });

  test('shows Finance Tools section', async ({ page }) => {
    await expect(page.getByText('Finance Tools')).toBeVisible();
  });
});
