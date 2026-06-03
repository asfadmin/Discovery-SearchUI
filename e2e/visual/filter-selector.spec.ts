import { test, expect } from '@playwright/test';

test('Ensure filter selector styling remains the same.', async ({ page }) => {
  await page.goto('http://localhost:4200/#/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page).toHaveScreenshot();
});
