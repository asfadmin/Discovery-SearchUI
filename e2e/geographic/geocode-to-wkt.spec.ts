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
