import { test, expect } from '@playwright/test';

const CUSTOMER_EMAIL = 'Shanna@melissa.tv';
const CUSTOMER_PASSWORD = 'password';

test.describe('Payments and pricing', () => {
  test('pricing page loads with subscription plans', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible();
  });

  test('pricing page shows membership plans', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForTimeout(2000);
    await expect(page.getByText(/membership/i).first()).toBeVisible();
  });

  test('pricing page shows class packs', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForTimeout(2000);
    await expect(page.getByText(/class.?pack/i).first()).toBeVisible();
  });

  test('customer can view subscription management page', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(CUSTOMER_EMAIL);
    await page.locator('input[type="password"]').fill(CUSTOMER_PASSWORD);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    await page.goto('/dashboard/subscription');
    await page.waitForTimeout(2000);
    await expect(page.getByRole('heading', { name: /subscription/i })).toBeVisible();
  });
});
