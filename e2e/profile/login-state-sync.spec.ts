import { test, expect } from 'e2e/fixtures';

test('Profile: login state is synced across instances', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  let loggedIn = false;

  await context.route('**/*', async (route) => {
    const url = route.request().url();
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const pathname = parsedUrl.pathname;

    if (
      url.includes('googletagmanager') ||
      url.includes('crazyegg') ||
      hostname === 'earthdata.nasa.gov' ||
      url.includes('feedback.js') ||
      /\.(png|jpg|jpeg|webp|gif|pbf)(\?|$)/i.test(url)
    ) {
      return route.abort();
    }

    if (
      url.includes('/services/utils/mission_list') ||
      (hostname === 'banners.asf.alaska.edu' && pathname === '/calendar')
    ) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]',
      });
    }

    if (url.includes('appdata') && url.includes('/Profile')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
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
        }),
      });
    }

    if (url.includes('/info/cookie')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          loggedIn
            ? {
                exp: 2978525424,
                'urs-access-token':
                  'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNzc4MDExOTc4LCJleHAiOjk5OTk5OTk5OTl9.',
                'urs-groups': [],
                'urs-user-id': 'automatedtesting_fullaccess',
              }
            : {},
        ),
      });
    }

    return route.continue();
  });

  const pageOne = await context.newPage();
  const pageTwo = await context.newPage();

  await pageOne.goto('/');
  await pageTwo.goto('/');

  await expect(pageOne.getByRole('button', { name: 'Sign In' })).toBeVisible();
  await expect(pageTwo.getByRole('button', { name: 'Sign In' })).toBeVisible();

  loggedIn = true;

  await pageOne.evaluate(() => {
    const bc = new BroadcastChannel('asf-vertex');
    bc.postMessage({ event: 'login' });
    bc.close();
  });

  await expect(
    pageTwo.getByRole('button', { name: 'automatedtesting_fullaccess' }),
  ).toBeVisible();

  await context.close();
});
