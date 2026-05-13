import { test, expect } from 'e2e/pages/auth.page';

test(
  'Profile: Edit saved search',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');

    await loggedInPage
      .getByRole('button', { name: 'Filters', exact: true })
      .click();

    await loggedInPage.locator('#mat-button-toggle-7').click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Save Search' }).click();
    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
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

    await loggedInPage
      .getByRole('button', { name: 'Filters', exact: true })
      .click();
    await loggedInPage.locator('#mat-button-toggle-7').click();
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
