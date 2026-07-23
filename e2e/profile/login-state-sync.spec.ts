import { test, expect } from 'e2e/fixtures';
import { login, standardizedPage } from 'e2e/helpers';

test('Profile: login state is synced across instances', async ({ page }) => {
  let loggedIn = false;

  await loggedInPage.route('**appdata**/info/cookie', async (route) => {
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

  const loggedInPage = await standardizedPage(await login(page));

  await expect(
    loggedInPage.getByRole('button', { name: 'Sign In' }),
  ).toBeVisible();

  loggedIn = true;

  await loggedInPage.evaluate(() => {
    const bc = new BroadcastChannel('asf-vertex');
    bc.postMessage({ event: 'login' });
    bc.close();
  });

  await expect(
    loggedInPage.getByRole('button', { name: 'automatedtesting_fullaccess' }),
  ).toBeVisible();
});
