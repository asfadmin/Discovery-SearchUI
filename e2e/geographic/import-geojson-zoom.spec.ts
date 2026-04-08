import { test, expect } from '@playwright/test';

test('Imported geojson point zooms map to location', async ({ page }) => {
  await page.goto('/');
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();
  await page
    .locator('app-aoi-filter')
    .getByRole('button', { name: 'Import File' })
    .click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/point.geojson');

  await page.waitForResponse((r) => r.url().includes('files_to_wkt'));

  const value = await page
    .locator('app-aoi-filter')
    .locator('input[name="searchPolygon"]')
    .inputValue();
  expect(value).toContain('POINT(-102.4805 38.7541)');

  await expect(page).toHaveURL(/center=-102\.48.*38\.75/);
});
