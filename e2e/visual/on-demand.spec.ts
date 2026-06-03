import { test, expect } from '@playwright/test';

test('Ensure on-demand drop down and menu styling remains the same', async ({
  page,
}) => {
  await page.goto('http://localhost:4200/#/');
  await page.getByRole('button', { name: 'On Demand' }).click();
  await expect(page).toHaveScreenshot();
  await page.getByRole('menuitem', { name: 'On Demand Queue' }).click();
  await expect(page).toHaveScreenshot();
});
