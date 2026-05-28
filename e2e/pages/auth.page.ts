import { Page } from '@playwright/test';
import { test as base } from 'e2e/fixtures';
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

    await use(page);
  },
});
export { expect } from '@playwright/test';
