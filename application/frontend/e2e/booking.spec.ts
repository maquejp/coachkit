import { test, expect } from '@playwright/test';

test.describe('Booking flow', () => {
  test('booking page loads with wizard structure', async ({ page }) => {
    await page.goto('/book');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('booking page shows content', async ({ page }) => {
    await page.goto('/book');
    // Should show some visible text content
    const bodyText = page.locator('body');
    await expect(bodyText).not.toBeEmpty();
  });

  test('booking page has interactive elements', async ({ page }) => {
    await page.goto('/book');
    // Should have clickable elements
    const buttons = page.getByRole('button');
    const links = page.getByRole('link');
    const clickableCount = (await buttons.count()) + (await links.count());
    expect(clickableCount).toBeGreaterThan(0);
  });
});
