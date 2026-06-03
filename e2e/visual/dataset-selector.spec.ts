import { test, expect } from '@playwright/test';

test('Ensure dataset dropdown styling remains the same.', async ({ page }) => {
  await page.goto('http://localhost:4200/#/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await expect(page).toHaveScreenshot();
});
