import { test, expect } from 'e2e/pages/auth.page';

test('SBAS: Saved Search', { tag: '@auth' }, async ({ loggedInPage }) => {
  await loggedInPage.goto('/');
  await loggedInPage.getByRole('button', { name: 'Geographic Search' }).click();
  await loggedInPage
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();

  await loggedInPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
    );
  await loggedInPage
    .locator('app-baseline-header app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .press('Enter');
  await loggedInPage
    .locator('app-baseline-header app-search-button .arrow-button-toggle')
    .click();
  await loggedInPage
    .getByRole('menuitem', { name: 'Saved Searches' })
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Save Search' }).click();

  await loggedInPage
    .getByRole('textbox', { name: 'Save Search Name' })
    .fill('test');
  await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
  await loggedInPage.getByText('keyboard_arrow_right').click();
  await expect(loggedInPage.locator('app-sbas-search-filters')).toContainText(
    'Reference: S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
  );
});
