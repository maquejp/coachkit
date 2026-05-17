import { test, expect } from '@playwright/test';

test.describe('Multi-language switching', () => {
  test('language switcher buttons are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'EN' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'FR' }).first()).toBeVisible();
  });

  test('switching to French changes page text', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    const originalText = await body.textContent();
    await page.getByRole('button', { name: 'FR' }).first().click();
    await page.waitForTimeout(500);
    const frenchText = await body.textContent();
    expect(frenchText).not.toBe(originalText);
  });

  test('EN button becomes active when switching back from FR', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'FR' }).first().click();
    await page.waitForTimeout(500);
    const enBtn = page.getByRole('button', { name: 'EN' }).first();
    const enClassBefore = await enBtn.getAttribute('class');
    expect(enClassBefore).not.toContain('bg-primary-100');
    await enBtn.click();
    await page.waitForTimeout(500);
    const enClassAfter = await enBtn.getAttribute('class');
    expect(enClassAfter).toContain('bg-primary-100');
  });

  test('language persists when navigating between pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'FR' }).first().click();
    await page.waitForTimeout(500);
    await page.goto('/classes');
    await page.waitForTimeout(500);
    const frBtn = page.getByRole('button', { name: 'FR' }).first();
    const frClass = await frBtn.getAttribute('class');
    expect(frClass).toContain('bg-primary-100');
  });
});
