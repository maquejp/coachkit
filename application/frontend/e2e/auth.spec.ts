import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('login page has heading and form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('login page has link to register', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.getByRole('link', { name: /sign.?up|register/i });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('register page has form fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login with invalid credentials stays on login page', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('nonexistent@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForTimeout(3000);
    // Should remain on the login page (not redirected to dashboard)
    await expect(page.locator('h1')).toBeVisible();
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated user redirected to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
  });

  test('unauthenticated user redirected to login from admin', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('/login', { timeout: 5000 });
  });

  test('unauthenticated user redirected to login from instructor', async ({ page }) => {
    await page.goto('/instructor');
    await page.waitForURL('/login', { timeout: 5000 });
  });
});
