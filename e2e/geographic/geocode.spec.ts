import { test, expect } from 'e2e/fixtures';
import {
  waitForASFAPIResponse,
  standardizedPage,
  mockGeocoding,
} from 'e2e/helpers';

test('Place name is geocoded to WKT AOI', async ({ page }) => {
  await mockGeocoding(page);
  await standardizedPage(page);
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'S1 Burst' }).click();

  const aoiFilter = page.locator('app-aoi-filter');
  await aoiFilter.locator('.additional-aoi-toggle').click();

  const geocodeInput = aoiFilter
    .locator('app-geocode-selector')
    .getByLabel('Search for a location');
  await geocodeInput.fill('Tibet');
  await page
    .getByRole('option', { name: 'Tibet Autonomous Region, China' })
    .click();

  await expect(aoiFilter.locator('input[name="searchPolygon"]')).toHaveValue(
    /POINT\(88\.0439 31\.5534\)/,
  );
  await expect(geocodeInput).toHaveValue(/Tibet Autonomous Region.*China/);
});

test('Place name geocode pans the map to the entered location', async ({
  page,
}) => {
  await mockGeocoding(page);
  await standardizedPage(page);

  const aoiFilter = page.locator('app-aoi-filter');
  await aoiFilter.locator('.additional-aoi-toggle').click();

  const geocodeInput = aoiFilter
    .locator('app-geocode-selector')
    .getByLabel('Search for a location');
  await geocodeInput.fill('Big Bear Lake');
  await page
    .getByRole('option', {
      name: 'Big Bear Lake, California, United States',
    })
    .click();

  await expect(aoiFilter.locator('input[name="searchPolygon"]')).toHaveValue(
    /POINT\(-116\.9115 34\.2437\)/,
  );
  await expect(geocodeInput).toHaveValue(
    /Big Bear Lake.*California.*United States/,
  );

  await expect(page).toHaveURL(/polygon=POINT/);
});

test('Geocoded place name is cleared when AOI is manually updated', async ({
  page,
}) => {
  await mockGeocoding(page);
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'S1 Burst' }).click();

  const aoiFilter = page.locator('app-aoi-filter');
  await aoiFilter.locator('.additional-aoi-toggle').click();

  const geocodeInput = aoiFilter
    .locator('app-geocode-selector')
    .getByLabel('Search for a location');
  await geocodeInput.fill('Sierra Le');
  await page
    .getByRole('option', {
      name: 'Sierra Leone Avenue, Nassau, New Providence, Bahamas',
    })
    .click();

  await expect(aoiFilter.locator('input[name="searchPolygon"]')).toHaveValue(
    /POINT\(-77\.3788 25\.0113\)/,
  );
  await expect(geocodeInput).toHaveValue(
    /Sierra Leone Avenue.*Nassau.*Bahamas/,
  );

  await aoiFilter
    .locator('textarea[name="searchPolygonLarge"]')
    .fill('POINT(-120.6999 38.3044)');

  const responsePromise = waitForASFAPIResponse(page);
  await page
    .locator('app-dataset-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await aoiFilter.locator('.additional-aoi-toggle').click();
  await expect(geocodeInput).toHaveValue('');
});
