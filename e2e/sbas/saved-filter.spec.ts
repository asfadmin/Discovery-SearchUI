import { test, expect } from 'e2e/pages/auth.page';

test('SBAS: Saved filters', { tag: '@auth' }, async ({ loggedInPage }) => {
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
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  await loggedInPage.getByRole('button', { name: 'SBAS Filters' }).click();
  await loggedInPage.getByText('% Overlap Threshold').click();
  await loggedInPage
    .getByRole('option', { name: 'Any Overlap Threshold' })
    .click();
  await loggedInPage.getByRole('switch', { name: 'Seasonal Search' }).click();

  await loggedInPage
    .locator(
      '.dataset-filters-card .footer app-search-button .arrow-button-toggle',
    )
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Save Filters' }).click();

  await loggedInPage.getByText('keyboard_arrow_right').click();
  await expect(loggedInPage.locator('app-save-user-filter')).toContainText(
    'Season: 1 to 180',
  );
  await expect(loggedInPage.locator('app-save-user-filter')).toContainText(
    'Pair Overlap Threshold: Any Overlap Threshold',
  );
  await expect(loggedInPage).toHaveScreenshot();
});
