import { test as base, Page } from '@playwright/test';

export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    let userHistory = [];
    await page.route('**appdata**/**/vertex/**/History', async (route) => {
      if (route.request().method() === 'POST') {
        userHistory = JSON.parse(route.request().postData());
      } else {
        route.fulfill({ body: JSON.stringify(userHistory) });
      }
    });
    let userSavedSearches = [];
    await page.route(
      '**appdata**/**/vertex/**/SavedSearches',
      async (route) => {
        if (route.request().method() === 'POST') {
          userSavedSearches = JSON.parse(route.request().postData());
        } else {
          route.fulfill({ body: JSON.stringify(userSavedSearches) });
        }
      },
    );
    let userSavedFilters = [];
    await page.route('**appdata**/**/vertex/**/SavedFilters', async (route) => {
      if (route.request().method() === 'POST') {
        userSavedFilters = JSON.parse(route.request().postData());
      } else {
        route.fulfill({ body: JSON.stringify(userSavedFilters) });
      }
    });

    await page.route('**appdata**/info/cookie', async (route) => {
      route.fulfill({
        body: JSON.stringify({
          exp: 2978525424,
          // fake edl token, that we have a really long expiration time set for
          'urs-access-token':
            'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNzc4MDExOTc4LCJleHAiOjk5OTk5OTk5OTl9.',
          'urs-groups': [],
          'urs-user-id': 'automatedtesting_fullaccess',
        }),
      });
    });
    let userProfile = {
      defaultDataset: 'SENTINEL-1',
      defaultFilterPresets: {
        'Baseline Search': '',
        'Geographic Search': '',
        'SBAS Search': '',
      },
      hyp3BackendUrl: 'https://hyp3-api.asf.alaska.edu',
      hyp3SavedUrls: ['https://hyp3-api.asf.alaska.edu'],
      language: 'en',
      mapLayer: 'Satellite',
      maxResults: '250',
      theme: 'light',
    };
    await page.route('**appdata**/**Profile', async (route) => {
      if (route.request().method() === 'POST') {
        userProfile = JSON.parse(route.request().postData());
      } else {
        route.fulfill({ body: JSON.stringify(userProfile) });
      }
    });
    await page.route('**/services/search/param**', async (route) => {
      const url = new URL(route.request().url());

      // remove the fake cmr_token
      url.searchParams.delete('cmr_token');

      route.continue({ url: url.toString() });
    });

    await use(page);
  },
});
export { expect } from '@playwright/test';
