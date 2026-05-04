import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const url = route.request().url();

      if (url.includes('localhost')) {
        return route.continue();
      }

      if (url.includes('api-test.asf.alaska.edu/services/utils/mission_list')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ result: [] }),
        });
      }

      if (url.includes('banners.asf.alaska.edu/calendar')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }

      const isThirdPartyScript =
        /(googletagmanager|crazyegg|earthdata\.nasa\.gov|feedback\.js)/.test(
          url,
        );
      const isExternalAsset = /\.(png|jpg|jpeg|pbf|webp|gif)(\?.*)?$/.test(url);

      if (isThirdPartyScript || isExternalAsset) {
        return route.abort();
      }

      return route.continue();
    });
    await use(page);
  },
});

export { expect };
