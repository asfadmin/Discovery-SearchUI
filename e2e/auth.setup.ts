import { chromium, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { overrideUserCookieHeaders } from 'e2e/helpers';

async function globalSetup() {
  // const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log('Running auth setup function');
  dotenv.config({ quiet: true });

  await page.goto('https://search.asf.alaska.edu');
  const popupPromise = page.waitForEvent('popup');
  if (!process.env['PLAYWRIGHT_USERNAME']) {
    console.log('No credentials defined: Some tests may fail');
    return;
  }
  console.log('Signing in');
  await page.getByRole('button', { name: 'Sign In' }).click();
  const popup = await popupPromise;
  await popup.getByLabel('username').fill(process.env['PLAYWRIGHT_USERNAME']);
  await popup.getByLabel('password').fill(process.env['PLAYWRIGHT_PASSWORD']);
  await overrideUserCookieHeaders(page);
  await popup.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('button', { name: 'Sign In' })).toHaveCount(0);
  console.log('Sign in successfull');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  await browser.close();
}

export default globalSetup;
