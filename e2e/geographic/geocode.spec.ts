import { test, expect } from '@playwright/test';
import { waitForASFAPIResponse } from 'e2e/helpers';

const MAPBOX_API_GLOB = 'https://api.mapbox.com/geocoding/**';

const MOCK_RESPONSES = {
  Tibet: {
    type: 'FeatureCollection',
    features: [
      {
        id: 'region.tibet',
        type: 'Feature',
        place_name: 'Tibet Autonomous Region, China',
        geometry: { type: 'Point', coordinates: [88.0439, 31.5534] },
        bbox: [78.3955, 26.8562, 99.1159, 36.4833],
      },
    ],
  },
  'Big Bear Lake': {
    type: 'FeatureCollection',
    features: [
      {
        id: 'place.bigbear',
        type: 'Feature',
        place_name: 'Big Bear Lake, California, United States',
        geometry: { type: 'Point', coordinates: [-116.9115, 34.2437] },
        bbox: [-116.95, 34.2, -116.87, 34.28],
      },
    ],
  },
  'Sierra Le': {
    type: 'FeatureCollection',
    features: [
      {
        id: 'place.sierra1',
        type: 'Feature',
        place_name: 'Sierra Leone',
        geometry: { type: 'Point', coordinates: [-11.7799, 8.4606] },
        bbox: [-13.3, 6.9, -10.3, 10.0],
      },
      {
        id: 'place.sierra2',
        type: 'Feature',
        place_name:
          'Sierra Leone Avenue, Nassau, New Providence, Bahamas',
        geometry: { type: 'Point', coordinates: [-77.3788, 25.0113] },
        bbox: [-77.38, 25.01, -77.37, 25.02],
      },
    ],
  },
};

async function mockGeocoding(page: any) {
  await page.route(MAPBOX_API_GLOB, (route: any) => {
    const url = route.request().url();
    let response = MOCK_RESPONSES['Tibet'];

    for (const key of Object.keys(MOCK_RESPONSES)) {
      if (url.includes(encodeURIComponent(key))) {
        response = MOCK_RESPONSES[key];
        break;
      }
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

test('Place name is geocoded to WKT AOI and returns search results', async ({
  page,
}) => {
  await mockGeocoding(page);
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
  await mockGeocoding(page);
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

  await expect(page).toHaveURL(/polygon=POINT/);
});

test('Geocoded place name is cleared when AOI is manually updated', async ({
  page,
}) => {
  await mockGeocoding(page);
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
