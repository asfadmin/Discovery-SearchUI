import { test, expect } from '@playwright/test';

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
