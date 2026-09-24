import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('CreatorStudioPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/creator');
  });

  test('page renders Creator Studio heading', async ({ page }) => {
    await expect(page.getByText("Creator's Studio")).toBeVisible();
  });

  test('quick create opens photo story composer', async ({ page }) => {
    await page.getByText('Photo Story').click();
    await expect(page.getByRole('heading', { name: 'New Photo Story' })).toBeVisible();
  });

  test('photo story can be published locally', async ({ page }) => {
    await page.getByText('Photo Story').click();
    await page.locator('textarea[placeholder*="caption"]').fill('Backyard science day');
    await page.getByRole('button', { name: /Publish to Family/i }).click();
    await expect(page.getByText('Photo Story published successfully!')).toBeVisible();
    await expect(page.getByText('Backyard science day')).toBeVisible();
  });

  test('family poll can add options', async ({ page }) => {
    await page.getByText('Family Poll').click();
    await page.getByRole('button', { name: /Add Option/i }).click();
    await expect(page.locator('input[placeholder="Option 3"]')).toBeVisible();
  });

  test('voice memo requires recording before publish', async ({ page }) => {
    await page.getByText('Voice Memo', { exact: true }).click();
    await expect(page.getByRole('button', { name: /Publish to Family/i })).toBeDisabled();
  });

  test('FAB opens create menu', async ({ page }) => {
    await page.locator('button.fixed').click();
    await expect(page.getByRole('heading', { name: 'What do you want to create?' })).toBeVisible();
  });
});
