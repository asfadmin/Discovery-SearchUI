import { test, expect } from 'e2e/fixtures';
import { login, standardizedPage } from 'e2e/helpers';

test(
  'Profile: Geographic Search History',
  { tag: '@auth' },
  async ({ page }) => {
    const loggedInPage = await standardizedPage(await login(page));

    await loggedInPage.goto('/#/?dataset=SENTINEL-1&maxResults=1');
    await loggedInPage
      .locator('app-dataset-header')
      .locator('app-search-button')
      .getByRole('button', { name: 'SEARCH' })
      .click();
    await loggedInPage
      .getByRole('button', { name: 'automatedtesting_fullaccess' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Search History' })
      .click();
    await loggedInPage.getByText('keyboard_arrow_right').first().click();
    await expect(
      loggedInPage.locator('app-geographic-search-filters'),
    ).toContainText('Dataset: SENTINEL-1');
  },
);
