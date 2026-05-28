import { test, expect } from 'e2e/pages/auth.page';

test(
  'Profile: Set saved search',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/?maxResults=1');
    const searchActionsButton = loggedInPage
      .locator('.dataset-filters-card .footer')
      .locator('app-search-button')
      .locator('.arrow-button-toggle');
    await loggedInPage
      .getByRole('button', { name: 'Filters', exact: true })
      .click();
    await loggedInPage
      .locator('div')
      .filter({ hasText: /^File Type$/ })
      .first()
      .click();
  await loggedInPage
      .getByRole('option', { name: 'L1 Detected High-Res Dual-Pol' })
      .click();
    await loggedInPage.locator('.cdk-overlay-backdrop').click();
    await searchActionsButton.click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Save Search' }).click();
    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
    await loggedInPage.getByRole('button', { name: 'Done' }).click();
    await loggedInPage.getByRole('button', { name: 'Cancel' }).click();
    await loggedInPage.getByRole('button', { name: 'Sentinel-' }).click();
    await loggedInPage
      .getByRole('menuitem', { name: 'S1 Bursts Sentinel-1 BURST' })
      .click();
    await loggedInPage
      .getByRole('button', { name: 'automatedtesting_fullaccess' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByRole('button', { name: 'image_search' }).click();
    await expect(loggedInPage.locator('app-info-bar')).toContainText(
      'File Types: GRD_HD',
    );
    await expect(loggedInPage.locator('app-dataset-selector')).toContainText(
      'Sentinel-1',
    );
  },
);

test(
  'Profile: Filter saved search',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/?maxResults=1');
    const searchActionsButton = loggedInPage
      .locator('.dataset-filters-card .footer')
      .locator('app-search-button')
      .locator('.arrow-button-toggle');
    await loggedInPage
      .getByRole('button', { name: 'Filters', exact: true })
      .click();
    await searchActionsButton.click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Save Search' }).click();
    await loggedInPage
      .getByRole('textbox', { name: 'Save Search Name' })
      .fill('test search');

    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
    await expect(loggedInPage.locator('app-saved-search')).toContainText(
      'test search',
    );
    await loggedInPage
      .getByRole('textbox', { name: 'Filter Searches' })
      .fill('not found');

    await expect(loggedInPage.locator('app-saved-search')).toHaveCount(0);
    await loggedInPage
      .getByRole('textbox', { name: 'Filter Searches' })
      .fill('test search');
    await expect(loggedInPage.locator('app-saved-search')).toContainText(
      'test search',
    );
  },
);
