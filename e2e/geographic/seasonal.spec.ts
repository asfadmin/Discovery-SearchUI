import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('switch', { name: 'Seasonal Search' }).click();
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('button', { name: '-' }).nth(2).click();
  await page.getByRole('button', { name: '-' }).nth(2).click();
  await page.getByRole('button', { name: '-' }).nth(2).click();
  await expect(page.locator('app-info-bar')).toContainText('Season: 3 - 177');
});
