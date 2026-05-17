import { test, expect } from '@playwright/test';

test.describe('Contact form submission', () => {
  const ts = Date.now();

  test('contact page loads with form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  });

  test('contact form has required fields', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test('contact form can be submitted successfully', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(1000);

    await page.getByLabel(/name/i).fill(`E2E Test User ${ts}`);
    await page.getByLabel(/email/i).fill(`e2e${ts}@test.com`);
    await page.getByLabel(/message/i).fill('This is an E2E test message.');

    await page.getByRole('button', { name: /send.?message/i }).click();
    await page.waitForTimeout(3000);

    // Should show success message
    await expect(page.getByText(/thank.?you/i)).toBeVisible();
  });
});
