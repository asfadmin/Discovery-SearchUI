import { test, expect } from '@playwright/test';

test('Import multiple geojson files sequentially', async ({ page }) => {
  await page.goto('/');
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();
  await page
    .locator('app-aoi-filter')
    .getByRole('button', { name: 'Import File' })
    .click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/basic.geojson');

  await page.waitForResponse((r) => r.url().includes('files_to_wkt'));

  const firstValue = await page
    .locator('app-aoi-filter')
    .locator('input[name="searchPolygon"]')
    .inputValue();
  expect(firstValue).toContain('POLYGON');

  await page
    .locator('app-aoi-filter')
    .getByRole('button', { name: 'Import File' })
    .click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/north-carolina.geojson');

  await page.waitForResponse((r) => r.url().includes('files_to_wkt'));

  const secondValue = await page
    .locator('app-aoi-filter')
    .locator('input[name="searchPolygon"]')
    .inputValue();
  expect(secondValue).toContain('POLYGON');
  expect(secondValue).not.toEqual(firstValue);
});
