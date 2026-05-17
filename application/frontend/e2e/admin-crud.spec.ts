import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'Sincere@april.biz';
const ADMIN_PASSWORD = 'testpassword123';

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15000 });
}

test.describe.serial('Admin Locations CRUD', () => {
  const ts = Date.now();
  const locName = `E2E Loc ${ts}`;
  const locEditName = `E2E Loc Edited ${ts}`;

  test('create location', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/locations');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /add.?location/i }).click();
    await page.waitForTimeout(500);

    await page.getByLabel('Name').fill(locName);
    await page.getByLabel('Address').fill('123 Test St');
    await page.getByLabel('City').fill('Test City');
    await page.getByLabel('Phone').fill('555-0000');
    await page.getByLabel('Email').fill('loc@e2e.test');

    await page.getByRole('button', { name: /create/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(locName)).toBeVisible();
  });

  test('edit location', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/locations');
    await page.waitForTimeout(1000);

    const card = page.locator('div.grid > div').filter({ hasText: locName });
    await card.getByRole('button', { name: /edit/i }).click();
    await page.waitForTimeout(500);

    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill(locEditName);

    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(locEditName)).toBeVisible();
  });

  test('delete location', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/locations');
    await page.waitForTimeout(1000);

    const card = page.locator('div.grid > div').filter({ hasText: locEditName });
    await card.getByRole('button', { name: /delete/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /yes.?delete/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(locEditName)).not.toBeVisible();
  });
});

test.describe.serial('Admin Classes CRUD', () => {
  const ts = Date.now();
  const className = `E2E Class ${ts}`;
  const classEditName = `E2E Class Edited ${ts}`;

  test('create class type', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/classes');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /add.?class/i }).click();
    await page.waitForTimeout(500);

    await page.getByLabel('Name').fill(className);
    await page.getByLabel(/description/i).fill('E2E test class description');

    await page.getByRole('button', { name: /create/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(className)).toBeVisible();
  });

  test('edit class type', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/classes');
    await page.waitForTimeout(1000);

    const card = page.locator('div.grid > div').filter({ hasText: className });
    await card.getByRole('button', { name: /edit/i }).click();
    await page.waitForTimeout(500);

    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill(classEditName);

    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(classEditName)).toBeVisible();
  });

  test('delete class type', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/classes');
    await page.waitForTimeout(1000);

    const card = page.locator('div.grid > div').filter({ hasText: classEditName });
    await card.getByRole('button', { name: /delete/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /yes.?delete/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(classEditName)).not.toBeVisible();
  });
});

test.describe.serial('Admin Instructors CRUD', () => {
  const ts = Date.now();
  const instrName = `E2E Instructor ${ts}`;
  const instrEditName = `E2E Instructor Edited ${ts}`;

  test('create instructor', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/instructors');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /add.?instructor/i }).click();
    await page.waitForTimeout(500);

    await page.getByLabel('Name').fill(instrName);
    await page.getByLabel('Email').fill(`instr${ts}@e2e.test`);

    await page.getByRole('button', { name: /create/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(instrName)).toBeVisible();
  });

  test('edit instructor', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/instructors');
    await page.waitForTimeout(1000);

    const card = page.locator('div.grid > div').filter({ hasText: instrName });
    await card.getByRole('button', { name: /edit/i }).click();
    await page.waitForTimeout(500);

    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill(instrEditName);

    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(instrEditName)).toBeVisible();
  });

  test('delete instructor', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/instructors');
    await page.waitForTimeout(1000);

    const card = page.locator('div.grid > div').filter({ hasText: instrEditName });
    await card.getByRole('button', { name: /delete/i }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /yes.?delete/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(instrEditName)).not.toBeVisible();
  });
});
