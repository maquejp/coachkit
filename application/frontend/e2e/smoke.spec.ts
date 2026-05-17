import { test, expect } from '@playwright/test';

test.describe('Public pages smoke tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page).toHaveTitle(/CoachKit|coachkit|Coaching/i);
  });

  test('classes page loads', async ({ page }) => {
    await page.goto('/classes');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('booking page loads', async ({ page }) => {
    await page.goto('/book');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('login page loads with form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
  });

  test('navigation links are present on home page', async ({ page }) => {
    await page.goto('/');
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    await expect(header.locator('a').first()).toBeVisible();
  });
});

test.describe('404 handling', () => {
  test('unknown page shows error', async ({ page }) => {
    await page.goto('/nonexistent-route');
    await expect(page.locator('h1, h2, p').first()).toBeVisible();
  });
});
