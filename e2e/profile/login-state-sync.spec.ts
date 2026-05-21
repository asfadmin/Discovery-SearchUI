import { test, expect } from 'e2e/fixtures';

test('Profile: login state is synced across instances', async ({ page }) => {
  let loggedIn = false;

  await page.route('**appdata**/**/Profile', async (route) => {
    await route.fulfill({
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
  });

  await page.route('**appdata**/info/cookie', async (route) => {
    await route.fulfill({
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
  });

  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

  loggedIn = true;

  await page.evaluate(() => {
    const bc = new BroadcastChannel('asf-vertex');
    bc.postMessage({ event: 'login' });
    bc.close();
  });

  await expect(page.getByRole('button', { name: 'automatedtesting_fullaccess' }))
    .toBeVisible();
});
