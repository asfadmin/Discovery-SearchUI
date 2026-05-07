import { Page } from '@playwright/test';

export async function waitForASFAPIResponse(page: Page) {
  return page.waitForResponse((response) =>
    response.url().includes('output=jsonlite2'),
  );
}

export async function overrideUserCookieHeaders(page: Page) {
  await page.route('**appdata-**/info/cookie', async (route) => {
    const response = await route.fetch();
    const url = new URL(page.url()).origin;
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        'Access-Control-Allow-Origin': url,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  });
}

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
        place_name: 'Sierra Leone Avenue, Nassau, New Providence, Bahamas',
        geometry: { type: 'Point', coordinates: [-77.3788, 25.0113] },
        bbox: [-77.38, 25.01, -77.37, 25.02],
      },
    ],
  },
};

export async function mockGeocoding(page: any) {
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
