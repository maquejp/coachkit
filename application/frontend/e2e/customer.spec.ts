import { test, expect } from '@playwright/test';

const CUSTOMER_EMAIL = 'Shanna@melissa.tv';
const CUSTOMER_PASSWORD = 'password';

test.describe('Customer dashboard', () => {
  async function loginAsCustomer(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(CUSTOMER_EMAIL);
    await page.locator('input[type="password"]').fill(CUSTOMER_PASSWORD);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  }

  test('customer can login and see dashboard welcome', async ({ page }) => {
    await loginAsCustomer(page);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/welcome.?back/i)).toBeVisible();
  });

  test('customer dashboard shows booking card', async ({ page }) => {
    await loginAsCustomer(page);
    await expect(page.getByText(/upcoming.?bookings/i)).toBeVisible();
  });

  test('customer dashboard shows subscription card', async ({ page }) => {
    await loginAsCustomer(page);
    await expect(page.getByText(/subscription/i)).toBeVisible();
  });

  test('customer can navigate to bookings page', async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto('/dashboard/bookings');
    await expect(page.getByRole('heading', { name: /my.?bookings/i })).toBeVisible();
  });

  test('customer can navigate to subscription page', async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto('/dashboard/subscription');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('customer can navigate to profile page', async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto('/dashboard/profile');
    await expect(page.locator('h1')).toBeVisible();
  });
});
