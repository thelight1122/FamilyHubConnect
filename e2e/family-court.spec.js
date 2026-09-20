import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('FamilyCourtPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/court');
  });

  test('page renders Accountability heading', async ({ page }) => {
    await expect(page.getByText('Accountability')).toBeVisible();
  });

  test('Active Reflections empty state is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Active Reflections' })).toBeVisible();
    await expect(page.getByText('No active reflections. The ledger is clear.')).toBeVisible();
  });

  test('new consequence requires required fields', async ({ page }) => {
    await page.locator('button:has(span.material-symbols-outlined:text("add"))').click();
    await page.getByRole('button', { name: /Record Reflection/i }).click();
    await expect(page.getByText('Please fill all fields')).toBeVisible();
  });

  test('can add a local consequence', async ({ page }) => {
    await page.locator('button:has(span.material-symbols-outlined:text("add"))').click();
    await page.locator('input[placeholder*="Screen Time"]').fill('Reflection check-in');
    await page.locator('input[placeholder*="Missed"]').fill('Missed family agreement');
    await page.getByRole('button', { name: /Record Reflection/i }).click();
    await expect(page.getByText('New reflection recorded')).toBeVisible();
    await expect(page.getByText('Reflection check-in')).toBeVisible();
  });

  test('empty court has no Mark Done buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Mark Done/i })).toHaveCount(0);
  });

  test('Reflection History section can load older history', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Reflection History' })).toBeVisible();
    await page.getByRole('button', { name: /Load Older History/i }).click();
    await expect(page.getByText('Loaded older history')).toBeVisible();
    await expect(page.getByText('Loss of TV Privileges')).toBeVisible();
  });
});
