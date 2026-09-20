import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('LoanPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/finance/loan');
  });

  test('page renders heading', async ({ page }) => {
    await expect(page.getByText(/Request|Pitch|Loan/i).first()).toBeVisible();
  });

  test('amount input accepts value', async ({ page }) => {
    const input = page.locator('input[placeholder*="amount"], input[placeholder*="Amount"], input[type="number"]').first();
    await input.fill('150');
    await expect(input).toHaveValue('150');
  });

  test('purpose input accepts value', async ({ page }) => {
    const input = page.locator('input[placeholder*="purpose"], input[placeholder*="Purpose"], textarea').first();
    await input.fill('New bicycle');
    await expect(input).toHaveValue('New bicycle');
  });

  test('submit navigates to loan confirmation', async ({ page }) => {
    await page.locator('button', { hasText: /Request|Submit|Apply/i }).click();
    await page.waitForURL('**/finance/loan/confirmation');
    expect(page.url()).toContain('/finance/loan/confirmation');
  });
});
