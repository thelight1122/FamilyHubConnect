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
    await expect(page.getByText('30kg')).toBeVisible();
    await expect(page.getByText('High')).toBeVisible();
  });

  test('Feeding Schedule section is visible', async ({ page }) => {
    await expect(page.getByText('Feeding Schedule')).toBeVisible();
    await expect(page.getByText('Morning Meal')).toBeVisible();
    await expect(page.getByText('Evening Meal')).toBeVisible();
  });

  test('Vet Appointments section is visible', async ({ page }) => {
    await expect(page.getByText('Vet Appointments')).toBeVisible();
    await expect(page.getByText('Annual Check-up')).toBeVisible();
  });
});
