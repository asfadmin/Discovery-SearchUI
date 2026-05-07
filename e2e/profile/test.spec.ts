import { test, expect } from 'e2e/pages/auth.page';

test('Profile: Logged In', { tag: '@auth' }, async ({ loggedInPage }) => {
  loggedInPage.goto('/');

  await expect(
    loggedInPage.getByRole('button', { name: 'automatedtesting_fullaccess' }),
  ).toBeVisible();
});
