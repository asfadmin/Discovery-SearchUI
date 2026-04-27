import { test, expect } from '@playwright/test';
import { overrideUserCookieHeaders } from 'e2e/helpers';

test('Profile: Logged In', { tag: '@auth' }, async ({ page }) => {
  await overrideUserCookieHeaders(page);
  await page.goto('/');

  await expect(
    page.getByRole('button', { name: 'automatedtesting_fullaccess' }),
  ).toBeVisible();
});
