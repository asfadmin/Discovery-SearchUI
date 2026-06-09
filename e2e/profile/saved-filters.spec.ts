import { test, expect } from 'e2e/pages/auth.page';

test('Profile: Delete filter', { tag: '@auth' }, async ({ loggedInPage }) => {
  await loggedInPage.goto('/');
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
  await loggedInPage
    .locator(
      '.dataset-filters-card .footer app-search-button .arrow-button-toggle',
    )
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'delete_forever' }).click();
  await expect(loggedInPage.getByRole('heading')).toContainText(
    'You have no saved Filters.',
  );
});
test('Profile: Apply filter', { tag: '@auth' }, async ({ loggedInPage }) => {
  await loggedInPage.goto('/');
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
  await loggedInPage
    .locator(
      '.dataset-filters-card .footer app-search-button .arrow-button-toggle',
    )
    .click();
  await expect(loggedInPage).toHaveScreenshot();

  await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
  await expect(loggedInPage).toHaveScreenshot();

  await loggedInPage.getByRole('menuitem', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Done' }).click();
  await loggedInPage.getByRole('button', { name: 'Cancel' }).click();
  await loggedInPage
    .getByRole('button', { name: 'automatedtesting_fullaccess' })
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Apply Filters' }).click();
  await expect(loggedInPage).toHaveScreenshot();

  await loggedInPage.getByRole('button', { name: 'Done' }).click();
  await expect(loggedInPage.locator('app-info-bar')).toContainText(
    'File Types: GRD_HD',
  );
});
