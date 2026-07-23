import { test as base, expect } from '@playwright/test';
import { sanitize } from 'e2e/helpers';
import * as fs from 'fs';

const THIRD_PARTY_PATTERN =
  /(googletagmanager|crazyegg|earthdata\.gov|feedback\.js)/;
const EXTERNAL_ASSET_PATTERN = /\.(png|jpg|jpeg|pbf|webp|gif)(\?.*)?$/;

const UPDATE = false;

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await page.route('**/*/tiles**', (route) => {
      route.fulfill({
        status: 200,
        path: 'e2e/assets/test_tile.png',
      });
    });
    await page.route('**/*/services/utils/mission_list**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: [] }),
      }),
    );

    await page.route('**/banners.asf.alaska.edu/calendar/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      }),
    );

    if (testInfo.retry === 0) {
      await page.routeFromHAR(
        `./e2e/hars/${testInfo.titlePath.slice(0, -1).join('/')}/${sanitize(testInfo.title)}.har`,
        {
          url: '**/services/**',
          update: UPDATE,
          notFound: 'fallback',
        },
      );
    }

    await page.route(
      'https://cdn.earthdata.nasa.gov/tophat2/tophat2.js',
      (route) => route.fulfill({ path: './e2e/tophat.js' }),
    );

    await page.route(
      (url) => THIRD_PARTY_PATTERN.test(url.href),
      (route) => route.abort(),
    );

    await page.route(
      (url) => EXTERNAL_ASSET_PATTERN.test(url.pathname),
      (route) => route.abort(),
    );

    await page.route(
      (url) => url.hostname === 'localhost',
      (route) => route.continue(),
    );

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus && UPDATE) {
      fs.unlinkSync(
        `./e2e/hars/${testInfo.titlePath.slice(0, -1).join('/')}/${sanitize(testInfo.title)}.har`,
      );
    }
  },
});

export { expect };
