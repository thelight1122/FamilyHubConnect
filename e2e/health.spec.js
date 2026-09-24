import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('HealthPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/health');
  });

  test('page renders Health Logs heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Health Logs' })).toBeVisible();
  });

  test('"Add Log" button opens modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add Log/i }).click();
    await expect(page.getByText('Log Health Event')).toBeVisible();
  });

  test('event type pill click selects type', async ({ page }) => {
    await page.getByRole('button', { name: /Add Log/i }).click();
    await page.getByRole('button', { name: 'Injury' }).click();
    await expect(page.getByRole('button', { name: 'Injury' })).toHaveClass(/bg-primary/);
  });

  test('log note textarea accepts text', async ({ page }) => {
    await page.getByRole('button', { name: /Add Log/i }).click();
    const textarea = page.locator('textarea[placeholder*="symptoms"]');
    await textarea.fill('Slight fever observed.');
    await expect(textarea).toHaveValue('Slight fever observed.');
  });

  test('Save button closes modal and shows toast', async ({ page }) => {
    await page.getByRole('button', { name: /Add Log/i }).click();
    await page.getByRole('button', { name: 'Save Log' }).click();
    await expect(page.getByText('Log Health Event')).not.toBeVisible();
    await expect(page.getByText('Health event logged!')).toBeVisible();
  });

  test('clicking backdrop closes modal without saving', async ({ page }) => {
    await page.getByRole('button', { name: /Add Log/i }).click();
    await expect(page.getByText('Log Health Event')).toBeVisible();
    // Click the backdrop (fixed overlay div)
    await page.mouse.click(10, 10);
    await expect(page.getByText('Log Health Event')).not.toBeVisible();
  });
});
