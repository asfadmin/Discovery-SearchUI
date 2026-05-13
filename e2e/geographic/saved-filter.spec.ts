import { test, expect } from 'e2e/pages/auth.page';

test('Geo: Saved Filters', { tag: '@auth' }, async ({ loggedInPage }) => {
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
  await loggedInPage.locator('#mat-button-toggle-7').click();
  await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Save Filters' }).click();
  await loggedInPage.getByText('keyboard_arrow_right').click();
  await expect(
    loggedInPage.locator('app-geographic-search-filters'),
  ).toContainText('File Types: GRD_HD');
});
