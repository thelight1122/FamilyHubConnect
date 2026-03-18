/**
 * Shared auth helper for Playwright tests.
 * Logs in via the login form and waits for dashboard redirect.
 */
export async function login(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@family.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}
