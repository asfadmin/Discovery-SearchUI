import { test, expect } from '@playwright/test';
import { waitForASFAPIResponse } from 'e2e/helpers';

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
