import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('TeamChatPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/sports/chat');
  });

  test('page renders Team Chat heading', async ({ page }) => {
    await expect(page.getByText('Team Chat')).toBeVisible();
  });

  test('shows empty messages state', async ({ page }) => {
    await expect(page.getByText('No messages yet — be the first!')).toBeVisible();
  });

  test('message input accepts text', async ({ page }) => {
    const input = page.locator('input[placeholder*="message"]');
    await input.fill('Hello team!');
    await expect(input).toHaveValue('Hello team!');
  });

  test('Send button appends message and clears input', async ({ page }) => {
    const input = page.locator('input[placeholder*="message"]');
    await input.fill('Test message');
    await page.getByRole('button').filter({ has: page.locator('.material-symbols-outlined:text("send")') }).click();
    await expect(page.getByText('Test message')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('Enter key sends message', async ({ page }) => {
    const input = page.locator('input[placeholder*="message"]');
    await input.fill('Enter key message');
    await input.press('Enter');
    await expect(page.getByText('Enter key message')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('attach button shows live storage toast', async ({ page }) => {
    await page.locator('button').filter({ has: page.locator('.material-symbols-outlined:text("add")') }).first().click();
    await expect(page.getByText('No live attachment storage configured yet.')).toBeVisible();
  });

  test('image button shows live storage toast', async ({ page }) => {
    await page.locator('button').filter({ has: page.locator('.material-symbols-outlined:text("image")') }).click();
    await expect(page.getByText('No live attachment storage configured yet.')).toBeVisible();
  });
});
