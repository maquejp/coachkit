import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'Sincere@april.biz';
const ADMIN_PASSWORD = 'password';

test.describe('Admin panel', () => {
  async function loginAsAdmin(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15000 });
  }

  test('admin can login and access dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator('h1, h2, p').first()).toBeVisible();
  });

  test('admin dashboard has content', async ({ page }) => {
    await loginAsAdmin(page);
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('admin can navigate to locations page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/locations');
    await page.waitForTimeout(2000);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('admin can navigate to classes page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/classes');
    await page.waitForTimeout(2000);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('admin can navigate to customers page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/customers');
    await page.waitForTimeout(2000);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
