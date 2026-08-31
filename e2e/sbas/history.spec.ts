import { test, expect } from 'e2e/fixtures';
import { loggedInSentinel1Page } from 'e2e/helpers';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('SBAS: Search History', { tag: '@auth' }, async ({ page }) => {
  const loggedInPage = await loggedInSentinel1Page(page);

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
  const searchResponse = waitForASFAPIResponse(loggedInPage);
  await loggedInPage
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();
  await searchResponse;
  await loggedInPage
    .getByRole('button', { name: 'automatedtesting_fullaccess' })
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Search History' }).click();
  await loggedInPage.getByText('keyboard_arrow_right').click();
  await expect(loggedInPage.locator('app-sbas-search-filters')).toContainText(
    'Reference: S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
  );
});
