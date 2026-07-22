import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('List Search: searching by scene names returns scenes', async ({
  page,
}) => {
  await page
    .locator('app-search-type-selector')
    .locator('button.button-menu-trigger')
    .click();
  await page.getByText('List', { exact: true }).click();

  await page
    .locator('app-list-header')
    .getByRole('button', { name: 'Edit List' })
    .click();

  await page
    .getByPlaceholder('List of scene names')
    .fill(
      [
        'S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906',
        'S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1',
        'ALPSRP111041130',
      ].join('\n'),
    );

  const searchResponse = waitForASFAPIResponse(page);
  const searchButton = page
    .locator('app-filters-dropdown')
    .locator('app-search-button');

  await searchButton.getByRole('button', { name: 'SEARCH' }).click();
  await searchResponse;

  await expect(searchButton).not.toContainText('NO RESULTS');
});
