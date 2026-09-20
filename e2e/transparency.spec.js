import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('TransparencyPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/transparency');
  });

  test('shows assistant and vault boundaries', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Family Hub Connect POD' })).toBeVisible();
    await expect(page.getByText('Assistant').first()).toBeVisible();
    await expect(page.getByText('Not enabled')).toBeVisible();
    await expect(page.getByText('No-Model Vault')).toBeVisible();
    await expect(page.getByText('Raw sensitive records remain unavailable to model context.')).toBeVisible();
  });
});
