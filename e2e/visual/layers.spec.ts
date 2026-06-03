import { test, expect } from '@playwright/test';

test('Ensure layers dropdown styling remains the same.', async ({ page }) => {
  await page.goto('http://localhost:4200/#/');
  await page.getByRole('button', { name: 'layer selector' }).click();
  await expect(page).toHaveScreenshot();
});
