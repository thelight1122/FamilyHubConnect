import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('LoanConfirmationPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/finance/loan/confirmation');
  });

  test('page renders confirmation content', async ({ page }) => {
    await expect(page.getByText(/confirm|approved|success/i).first()).toBeVisible();
  });

  test('return button navigates back to finance', async ({ page }) => {
    await page.locator('button', { hasText: /Back|Return|Done|Finance/i }).first().click();
    await page.waitForURL('**/finance');
    expect(page.url()).toContain('/finance');
  });
});
