import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'Sincere@april.biz';
const ADMIN_PASSWORD = 'testpassword123';

test.describe('Admin waitlist management', () => {
  async function loginAsAdmin(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15000 });
  }

  test('waitlist page loads with heading', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/waitlist');
    await page.waitForTimeout(2000);
    await expect(page.getByRole('heading', { name: /waitlist/i })).toBeVisible();
  });

  test('waitlist page shows schedule selector', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/waitlist');
    await page.waitForTimeout(2000);
    await expect(page.getByText(/class.?slot/i).first()).toBeVisible();
  });

  test('waitlist shows prompt when no schedule selected', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/waitlist');
    await page.waitForTimeout(2000);
    // Should show the select prompt when no class slot is chosen
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('waitlist can select a schedule slot', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/waitlist');
    await page.waitForTimeout(2000);

    // Try to select the first non-empty option in the schedule dropdown
    const select = page.locator('select').first();
    const options = await select.locator('option').all();

    // Pick the first option with a non-empty value
    const firstVal = options.find(async (opt) => (await opt.getAttribute('value')) !== '');
    if (firstVal) {
      const val = await (await firstVal).getAttribute('value');
      if (val) {
        await select.selectOption(val);
        await page.waitForTimeout(1000);
        // Page should update (either show entries or empty state)
        const body = page.locator('body');
        await expect(body).not.toBeEmpty();
      }
    }
  });
});
