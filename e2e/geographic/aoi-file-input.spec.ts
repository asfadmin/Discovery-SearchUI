import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('Import a geojson point file', async ({ page }) => {
  await sentinel1Page(page);
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();

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
});

test('Import a KML file', async ({ page }) => {
  await sentinel1Page(page);
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();

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

test('Import a .shp shape file', async ({ page }) => {
  await sentinel1Page(page);
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/boundary.shp');

  await page.waitForResponse((r) => r.url().includes('files_to_wkt'));

  const value = await page
    .locator('app-aoi-filter')
    .locator('input[name="searchPolygon"]')
    .inputValue();
  expect(value).toContain('POLYGON');
});

test('Import a .zip shape file', async ({ page }) => {
  await sentinel1Page(page);
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/boundary.zip');

  await page.waitForResponse((r) => r.url().includes('files_to_wkt'));

  const value = await page
    .locator('app-aoi-filter')
    .locator('input[name="searchPolygon"]')
    .inputValue();
  expect(value).toContain('POLYGON');
});

test('Import multiple geojson files sequentially', async ({ page }) => {
  await sentinel1Page(page);

  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();

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

test('Import rejects invalid file type', async ({ page }) => {
  await sentinel1Page(page);

  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();

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
