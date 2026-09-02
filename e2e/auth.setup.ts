import { chromium, expect } from '@playwright/test';
import dotenv from 'dotenv';

import { overrideUserCookieHeaders } from 'e2e/helpers';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log('Running auth setup function');
  dotenv.config({ quiet: true });

  await page.goto('https://search.asf.alaska.edu');

  if (!process.env['PLAYWRIGHT_USERNAME']) {
    console.log('No credentials defined: Some tests may fail');
    return;
  }

  console.log('Signing in');
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Sign In' }).click();
  const popup = await popupPromise;

  await popup.getByLabel('username').fill(process.env['PLAYWRIGHT_USERNAME']);
  await popup.getByLabel('password').fill(process.env['PLAYWRIGHT_PASSWORD']);
  await overrideUserCookieHeaders(page);

  await popup.getByRole('button', { name: 'Log in' }).click();

  await popup.waitForEvent('close');

  await expect(page.getByRole('button', { name: 'Sign In' })).toHaveCount(0, {
    timeout: 15_000,
  });

  console.log('Sign in successful');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  await browser.close();
}

export default globalSetup;
