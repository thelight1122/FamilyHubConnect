import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('AssistantPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/assistant');
  });

  test('renders bounded no-model assistant shell', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Bounded Assistant Shell' })).toBeVisible();
    await expect(page.getByText('Local preview only. No model call is made from this screen.')).toBeVisible();
    await expect(page.getByText('No model access').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Transparency record' })).toBeVisible();
  });

  test('withholds sensitive health-record context', async ({ page }) => {
    await page.locator('#assistant-request').fill('Can you read the health records and tell me what is wrong?');

    await expect(page.getByRole('heading', { name: 'Context withheld' })).toBeVisible();
    await expect(page.getByText('Raw vault records').first()).toBeVisible();
    await expect(page.getByText(/human-approved/i)).toBeVisible();
  });
});
