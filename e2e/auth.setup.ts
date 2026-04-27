import { expect, test as setup } from '@playwright/test';
import path from 'path';
import { overrideUserCookieHeaders } from 'e2e/helpers';
import dotenv from 'dotenv';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
setup('authenticate', async ({ page }) => {
  dotenv.config();

  await page.goto('https://search.asf.alaska.edu');
  const popupPromise = page.waitForEvent('popup');

  await page.getByRole('button', { name: 'Sign In' }).click();
  const popup = await popupPromise;
  await popup.getByLabel('username').fill(process.env['PLAYWRIGHT_USERNAME']);
  await popup.getByLabel('password').fill(process.env['PLAYWRIGHT_PASSWORD']);
  await popup.getByRole('button', { name: 'Log in' }).click();
  await overrideUserCookieHeaders(page);
  await expect(page.getByRole('button', { name: 'Sign In' })).toHaveCount(0);

  await page.context().storageState({ path: authFile });
});
