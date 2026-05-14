import { test, expect } from 'e2e/pages/auth.page';

test('Baseline: Saved filters', { tag: '@auth' }, async ({ loggedInPage }) => {
  await loggedInPage.goto('/');
  await loggedInPage.getByRole('button', { name: 'Geographic Search' }).click();
  await loggedInPage
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();
  await loggedInPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .click();
  await loggedInPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('R1_65192_ST6_F111');
  await loggedInPage
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await loggedInPage.getByRole('radio', { name: 'Baseline Criteria' }).click();

  await loggedInPage.getByRole('switch', { name: 'Seasonal Search' }).click();
  await loggedInPage.locator('#mat-button-toggle-7').click();
  await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Save Filters' }).click();
  await loggedInPage.getByText('keyboard_arrow_right').click();
  await expect(loggedInPage.locator('app-save-user-filter')).toContainText(
    'Season: 1 to 180',
  );
});
