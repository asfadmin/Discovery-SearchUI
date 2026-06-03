import { test, expect } from '@playwright/test';

test('Ensure help dropdown styling remains the same.', async ({ page }) => {
  await page.goto('http://localhost:4200/#/');
  await page.getByRole('button', { name: 'Help' }).click();
  await expect(page).toHaveScreenshot();
});
