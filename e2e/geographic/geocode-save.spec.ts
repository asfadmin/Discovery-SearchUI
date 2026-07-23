import { test, expect } from 'e2e/fixtures';
import { mockGeocoding, login, standardizedPage } from 'e2e/helpers';

test(
  'Geographic: Save with geocoded area',
  { tag: '@auth' },
  async ({ page }) => {
    const loggedInPage = await standardizedPage(await login(page));

    await mockGeocoding(loggedInPage);
    await loggedInPage.goto('/?dataset=SENTINEL-1&maxResults=1');
    await loggedInPage
      .locator('app-aoi-filter')
      .getByText('arrow_drop_down')
      .click();
    await loggedInPage
      .locator('app-aoi-filter')
      .locator('app-geocode-selector')
      .getByLabel('Search for a location')
      .fill('f');
    await loggedInPage.getByText('Tibet Autonomous Region, China').click();
    await loggedInPage
      .locator('app-dataset-header app-search-button .arrow-button-toggle')
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Save Search' }).click();
    await expect(
      loggedInPage.getByRole('textbox', { name: 'Save Search Name' }),
    ).toBeVisible();
  },
);
