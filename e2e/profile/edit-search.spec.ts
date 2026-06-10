import { test, expect } from 'e2e/pages/auth.page';

test(
  'Profile: Edit saved search',
  { tag: ['@auth', '@visual'] },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
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
    await expect(loggedInPage).toHaveScreenshot();

    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
    await expect(loggedInPage).toHaveScreenshot();

    await loggedInPage.locator('app-saved-search').getByText('edit').click();
    await loggedInPage.getByRole('textbox', { name: 'Search Name' }).click();
    await loggedInPage
      .getByRole('textbox', { name: 'Search Name' })
      .fill('test');
    await loggedInPage
      .getByRole('textbox', { name: 'Search Name' })
      .press('Enter');
    await expect(loggedInPage.locator('app-saved-search')).toContainText(
      'test',
    );
  },
);

test(
  'Profile: Delete saved search',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
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
    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
    await expect(
      loggedInPage.getByText('keyboard_arrow_right No Name'),
    ).toBeVisible();
    await loggedInPage.getByRole('button', { name: 'delete_forever' }).click();
    await expect(
      loggedInPage.getByText('keyboard_arrow_right No Name'),
    ).not.toBeVisible();
  },
);

test(
  'Profile: Update saved search',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
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
    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
    await loggedInPage.getByRole('button', { name: 'Done' }).click();

    await loggedInPage
      .locator('div')
      .filter({ hasText: /^File Type$/ })
      .first()
      .click();
    await loggedInPage
      .getByRole('option', { name: 'L1 Detected High-Res Dual-Pol' })
      .click();
    await loggedInPage.locator('.cdk-overlay-backdrop').click();

    await loggedInPage
      .getByRole('button', { name: 'automatedtesting_fullaccess' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByText('keyboard_arrow_right').click();
    await expect(loggedInPage.locator('app-saved-search')).not.toContainText(
      'File Types: GRD_HD Update',
    );
    await loggedInPage.getByRole('button', { name: 'Update' }).click();
    await expect(loggedInPage.locator('app-saved-search')).toContainText(
      'Dataset: SENTINEL-1 File Types: GRD_HD Update',
    );
  },
);
