import { Page } from '@playwright/test';

const userServiceMock = async (
  page: Page,
  route: string,
  default_data: any[] | unknown = [],
) => {
  let data = default_data;
  await page.route(route, async (route) => {
    if (route.request().method() === 'POST') {
      data = JSON.parse(route.request().postData());
    } else {
      route.fulfill({ body: JSON.stringify(data) });
    }
  });
};

export async function login(page: Page) {
  await userServiceMock(page, '**appdata**/**/vertex/**/History');
  await userServiceMock(page, '**appdata**/**/vertex/**/SavedSearches');
  await userServiceMock(page, '**appdata**/**/vertex/**/SavedFilters');
  await userServiceMock(page, '**appdata**/**/Profile', {
    defaultFilterPresets: {
      'Baseline Search': '',
      'Geographic Search': '',
      'SBAS Search': '',
      Displacement: '',
    },
    defaultMaxConcurrentDownloads: 3,
    hyp3BackendUrl: 'https://hyp3-api.asf.alaska.edu',
    hyp3SavedUrls: ['https://hyp3-api.asf.alaska.edu'],
    language: 'en',
    mapLayer: 'Satellite',
    maxResults: 250,
    theme: 'light',
  });
  await page.route('**appdata**/info/cookie', async (route) => {
    const current_date = new Date();
    const future_date =
      new Date(
        // 20 days in the future
        current_date.setDate(current_date.getDate() + 20),
      ).getTime() / 1000;
    route.fulfill({
      body: JSON.stringify({
        exp: future_date,
        // fake token with just expiration date in it
        'urs-access-token': `a.${btoa(
          JSON.stringify({
            exp: future_date,
          }),
        )}`,
        'urs-groups': [],
        'urs-user-id': 'automatedtesting_fullaccess',
      }),
    });
  });
  await page.route('**/services/search/**', async (route) => {
    const url = new URL(route.request().url());

    // remove the fake cmr_token
    url.searchParams.delete('cmr_token');

    route.continue({ url: url.toString() });
  });
  await page.route('**hyp3**/user', (route) => {
    route.fulfill({
      body: JSON.stringify({
        application_status: 'APPROVED',
        remaining_credits: 8000,
        user_id: 'automatedtesting_fullaccess',
        job_names: ['Test job'],
      }),
    });
  });
  await page.route('**hyp3**/costs', (route) => {
    route.fulfill({
      body: JSON.stringify({
        AUTORIFT: {
          cost: 25,
        },
        INSAR_GAMMA: {
          cost_parameters: ['looks'],
          cost_table: {
            '20x4': 10,
            '10x2': 15,
          },
        },
        RTC_GAMMA: {
          cost_parameters: ['resolution'],
          cost_table: {
            '10': 60,
            '20': 15,
            '30': 5,
          },
        },
        INSAR_ISCE_BURST: {
          cost: 1,
        },
        INSAR_ISCE_MULTI_BURST: {
          cost_parameters: ['looks', 'reference'],
          cost_table: {
            '20x4': {
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 1,
              '5': 5,
              '6': 5,
              '7': 5,
              '8': 5,
              '9': 5,
              '10': 5,
              '11': 5,
              '12': 5,
              '13': 10,
              '14': 10,
              '15': 10,
            },
            '10x2': {
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 5,
              '5': 5,
              '6': 5,
              '7': 5,
              '8': 5,
              '9': 5,
              '10': 10,
              '11': 10,
              '12': 10,
              '13': 10,
              '14': 10,
              '15': 10,
            },
            '5x1': {
              '1': 1,
              '2': 5,
              '3': 10,
              '4': 15,
              '5': 20,
              '6': 25,
              '7': 30,
              '8': 35,
              '9': 40,
              '10': 45,
              '11': 90,
              '12': 95,
              '13': 100,
              '14': 105,
              '15': 110,
            },
          },
        },
        ARIA_S1_GUNW: {
          cost: 60,
        },
        OPERA_DISP_TMS: {
          cost: 10001,
        },
      }),
    });
  });

  return page;
}

export async function standardizedPage(page: Page) {
  await page.goto('/#/?dataset=SENTINEL-1');
  return page;
}

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
        jobs: [...Array(10)].map((_x) => {
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

/*
From node-sanitize-filename-js
https://github.com/parshap/node-sanitize-filename
*/
const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g; // eslint-disable-line
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

function replaceTrailingDotsAndSpaces(str, replacement) {
  let end = str.length;
  while (end > 0 && (str[end - 1] === '.' || str[end - 1] === ' ')) end--;
  return end < str.length ? str.slice(0, end) + replacement : str;
}

export function sanitize(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  let sanitized = input
    .replace(illegalRe, '')
    .replace(controlRe, '')
    .replace(reservedRe, '')
    .replace(windowsReservedRe, '');
  sanitized = replaceTrailingDotsAndSpaces(sanitized, '');
  return sanitized.slice(0, 255);
}
