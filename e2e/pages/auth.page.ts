import { test as base, Page } from '@playwright/test';
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

export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await userServiceMock(page, '**appdata**/**/vertex/**/History');
    await userServiceMock(page, '**appdata**/**/vertex/**/SavedSearches');
    await userServiceMock(page, '**appdata**/**/vertex/**/SavedFilters');
    await userServiceMock(page, '**appdata**/**/Profile', {
      defaultDataset: 'SENTINEL-1',
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
      route.fulfill({
        body: JSON.stringify({
          exp: 2978525424,
          // fake token with just expiration date in it
          'urs-access-token':
            'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNzc4MDExOTc4LCJleHAiOjk5OTk5OTk5OTl9.',
          'urs-groups': [],
          'urs-user-id': 'automatedtesting_fullaccess',
        }),
      });
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
