import { test, expect } from '@playwright/test';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Place name is geocoded to WKT AOI and returns search results', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'S1 Burst' }).click();

  const aoiFilter = page.locator('app-aoi-filter');
  await aoiFilter.locator('.additional-aoi-toggle').click();

  const geocodeInput = aoiFilter
    .locator('app-geocode-selector')
    .getByLabel('Search for a location');
  await geocodeInput.fill('Tibet');
  await page.getByRole('option').first().click();

  await expect(aoiFilter.locator('input[name="searchPolygon"]')).toHaveValue(
    /POINT\(88\.0439 31\.5534\)/,
  );
  await expect(geocodeInput).toHaveValue(/Tibet Autonomous Region.*China/);

  const responsePromise = waitForASFAPIResponse(page);
  await page
    .locator('#mat-button-toggle-8-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await expect(page.locator('mat-card-header').first()).toBeVisible();
});

test('Place name geocode pans the map to the entered location', async ({
  page,
}) => {
  await page.goto('/');

  const aoiFilter = page.locator('app-aoi-filter');
  await aoiFilter.locator('.additional-aoi-toggle').click();

  const geocodeInput = aoiFilter
    .locator('app-geocode-selector')
    .getByLabel('Search for a location');
  await geocodeInput.fill('Big Bear Lake');
  await page.getByRole('option').first().click();

  await expect(aoiFilter.locator('input[name="searchPolygon"]')).toHaveValue(
    /POINT\(-116\.9115 34\.2437\)/,
  );
  await expect(geocodeInput).toHaveValue(
    /Big Bear Lake.*California.*United States/,
  );

  await expect(page).toHaveURL(/center=-116\.91.*34\.24/);
});

test('Geocoded place name is cleared when AOI is manually updated', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'S1 Burst' }).click();

  const aoiFilter = page.locator('app-aoi-filter');
  await aoiFilter.locator('.additional-aoi-toggle').click();

  const geocodeInput = aoiFilter
    .locator('app-geocode-selector')
    .getByLabel('Search for a location');
  await geocodeInput.fill('Sierra Le');
  await page.getByRole('option').nth(1).click();

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
    .locator('#mat-button-toggle-8-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await aoiFilter.locator('.additional-aoi-toggle').click();
  await expect(geocodeInput).toHaveValue('');
});
