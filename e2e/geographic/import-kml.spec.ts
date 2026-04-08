import { test, expect } from '@playwright/test';

test('Import a KML file', async ({ page }) => {
  await page.goto('/');
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();
  await page
    .locator('app-aoi-filter')
    .getByRole('button', { name: 'Import File' })
    .click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/basic.kml');

  await page.waitForResponse((r) => r.url().includes('files_to_wkt'));

  const value = await page
    .locator('app-aoi-filter')
    .locator('input[name="searchPolygon"]')
    .inputValue();
  expect(value).toContain('POLYGON');
  expect(value).toContain('-43.7081');
});
