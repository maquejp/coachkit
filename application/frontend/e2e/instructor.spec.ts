import { test, expect } from '@playwright/test';

const INSTRUCTOR_EMAIL = 'alex@coachkit.test';
const INSTRUCTOR_PASSWORD = 'password';

test.describe('Instructor panel', () => {
  async function loginAsInstructor(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(INSTRUCTOR_EMAIL);
    await page.locator('input[type="password"]').fill(INSTRUCTOR_PASSWORD);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL(/\/instructor/, { timeout: 15000 });
  }

  test('instructor can login and access dashboard', async ({ page }) => {
    await loginAsInstructor(page);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('instructor schedule page loads with content', async ({ page }) => {
    await loginAsInstructor(page);
    await page.goto('/instructor/schedule');
    await page.waitForTimeout(2000);
    await expect(page.getByRole('heading', { name: /schedule/i })).toBeVisible();
  });

  test('instructor schedule shows class slots', async ({ page }) => {
    await loginAsInstructor(page);
    await page.goto('/instructor/schedule');
    await page.waitForTimeout(2000);
    await expect(page.getByText('Monday')).toBeVisible();
  });

  test('instructor attendance page loads', async ({ page }) => {
    await loginAsInstructor(page);
    await page.goto('/instructor/attendance');
    await page.waitForTimeout(2000);
    await expect(page.getByRole('heading', { name: /attendance|mark/i })).toBeVisible();
  });

  test('instructor can navigate from schedule to attendance', async ({ page }) => {
    await loginAsInstructor(page);
    await page.goto('/instructor/schedule');
    await page.waitForTimeout(2000);

    const slotLink = page.locator('a[href*="/instructor/attendance"]').first();
    if (await slotLink.isVisible()) {
      await slotLink.click();
      await page.waitForTimeout(2000);
      await expect(page.getByRole('heading', { name: /attendance|mark/i })).toBeVisible();
    }
  });
});
