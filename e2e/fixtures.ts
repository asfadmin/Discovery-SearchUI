import { test as base, expect } from '@playwright/test';
import { mixinFixtures as mixinCoverage } from '@bgotink/playwright-coverage';

const THIRD_PARTY_PATTERN =
  /(googletagmanager|crazyegg|earthdata\.nasa\.gov|feedback\.js)/;
const EXTERNAL_ASSET_PATTERN = /\.(png|jpg|jpeg|pbf|webp|gif)(\?.*)?$/;

export const test = mixinCoverage(
  base.extend({
    page: async ({ page }, use) => {
      await page.route('**/*/services/utils/mission_list**', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ result: [] }),
        }),
      );

      await page.route('**/banners.asf.alaska.edu/calendar', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        }),
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
    },
  }),
);

export { expect };
