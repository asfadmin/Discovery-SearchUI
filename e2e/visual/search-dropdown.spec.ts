import { test, expect } from '@playwright/test';

test('Ensure search-dropdown styling remains the same.', async ({ page }) => {
  await page.goto('http://localhost:4200/#/');
  await page.locator('#mat-button-toggle-9-button').click();
  await expect(page).toHaveScreenshot();
});
