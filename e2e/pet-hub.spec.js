import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.describe('PetHubPage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/more/pets');
  });

  test('page renders Pet Hub heading', async ({ page }) => {
    await expect(page.getByText('Pet Hub')).toBeVisible();
  });

  test('shows empty walks state when no walks recorded', async ({ page }) => {
    await expect(page.getByText('No walks recorded yet.')).toBeVisible();
  });

  test('pet profile stats are visible', async ({ page }) => {
    await expect(page.getByText('No live pet entered')).toBeVisible();
    await expect(page.getByText('--')).toHaveCount(3);
  });

  test('Feeding Schedule section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Feeding Schedule' })).toBeVisible();
    await expect(page.getByText('No live feeding schedule entered')).toBeVisible();
  });

  test('Vet Appointments section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Vet Appointments' })).toBeVisible();
    await expect(page.getByText('No live vet appointments entered')).toBeVisible();
  });
});
