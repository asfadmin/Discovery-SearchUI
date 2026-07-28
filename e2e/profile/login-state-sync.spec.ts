import { test, expect } from 'e2e/fixtures';
import { login, sentinel1Page } from 'e2e/helpers';

test('Profile: login state is synced across instances', async ({ page }) => {
  await sentinel1Page(page);
  let loggedIn = false;

  await page.route('**appdata**/info/cookie', async (route) => {
    if (!loggedIn) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(JSON.stringify({})),
      });
    } else {
      route.fallback();
    }
  });

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

  loggedIn = true;

  const loggedInPage = await login(page);

  await loggedInPage.evaluate(() => {
    const bc = new BroadcastChannel('asf-vertex');
    bc.postMessage({ event: 'login' });
    bc.close();
  });

  await expect(
    loggedInPage.getByRole('button', { name: 'automatedtesting_fullaccess' }),
  ).toBeVisible();
});
