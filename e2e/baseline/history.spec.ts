import { test, expect } from 'e2e/pages/auth.page';

test('Baseline: Search History', { tag: '@auth' }, async ({ loggedInPage }) => {
  await loggedInPage.goto('/');
  await loggedInPage.getByRole('button', { name: 'Geographic Search' }).click();
  await loggedInPage
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();

  await loggedInPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
    );
  await loggedInPage
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await loggedInPage
    .getByRole('button', { name: 'automatedtesting_fullaccess' })
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Search History' }).click();
  await loggedInPage.getByText('keyboard_arrow_right').click();
  await expect(
    loggedInPage.locator('app-baseline-search-filters'),
  ).toContainText(
    'Reference: S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
  );
});
