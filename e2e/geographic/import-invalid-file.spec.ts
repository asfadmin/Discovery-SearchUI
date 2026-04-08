import { test, expect } from '@playwright/test';

test('Import rejects invalid file type', async ({ page }) => {
  await page.goto('/');
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();
  await page
    .locator('app-aoi-filter')
    .getByRole('button', { name: 'Import File' })
    .click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/invalid.csv');

  const aoiValue = await page
    .locator('app-aoi-filter')
    .locator('input[name="searchPolygon"]')
    .inputValue();
  expect(aoiValue).toBe('');
});
