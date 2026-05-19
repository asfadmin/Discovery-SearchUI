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

const MAPBOX_GEOCODING_API_GLOB = 'https://api.mapbox.com/geocoding/**';

const MOCK_GEOCODING_RESPONSES = {
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
  await page.route(MAPBOX_GEOCODING_API_GLOB, (route: any) => {
    const url = route.request().url();
    let response = MOCK_GEOCODING_RESPONSES['Tibet'];

    for (const key of Object.keys(MOCK_GEOCODING_RESPONSES)) {
      if (url.includes(encodeURIComponent(key))) {
        response = MOCK_GEOCODING_RESPONSES[key];
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

export async function setupOnDemand(page: Page, job_overrides: object = {}) {
  await page.route('**hyp3**/jobs**', (route) => {
    route.fulfill({
      body: JSON.stringify({
        jobs: [...Array(10)].map((x) => {
          return {
            job_type: 'RTC_GAMMA',
            browse_images: [],
            files: [],
            priority: 7959,
            job_parameters: {
              speckle_filter: false,
              include_inc_map: false,
              dem_name: 'copernicus',
              radiometry: 'gamma0',
              granules: [
                'S1A_IW_GRDH_1SDV_20210628T015845_20210628T015910_038534_048C1A_826C',
              ],
              scale: 'power',
              dem_matching: false,
              resolution: 30,
              include_rgb: false,
              include_dem: false,
              include_scattering_area: false,
            },
            job_id: crypto.randomUUID(),
            processing_times: [487.668],
            thumbnail_images: [],
            logs: [],
            credit_cost: 5,
            expiration_time: '2000-05-13T00:00:00+00:00',
            request_time: '2026-04-28T18:48:40+00:00',
            execution_started: true,
            status_code: 'SUCCEEDED',
            user_id: 'automatedtesting_fullaccess',
            ...job_overrides,
          };
        }),
      }),
    });
  });
}
