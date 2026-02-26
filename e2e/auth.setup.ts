import { expect, test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// import { username, password } from '../playwright/.auth/creds.json';
const authFile = path.join(__dirname, '../playwright/.auth/user.json');
const credsFile = path.join(__dirname, '../playwright/.auth/creds.json');
setup('authenticate', async ({ page }) => {
  let userData = {};
  try {
    const data = fs.readFileSync(credsFile, 'utf8');
    userData = JSON.parse(data);
  } catch (e) {
    console.error('Error reading or parsing JSON file:', e);
    return;
  }
  await page.goto('https://search.asf.alaska.edu');
  const popupPromise = page.waitForEvent('popup');

  await page.getByRole('button', { name: 'Sign In' }).click();
  const popup = await popupPromise;
  await popup.getByLabel('username').fill(userData['username']);
  await popup.getByLabel('password').fill(userData['password']);
  await popup.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('button', { name: 'Sign In' })).toHaveCount(0);

  await page.context().storageState({ path: authFile });
});
