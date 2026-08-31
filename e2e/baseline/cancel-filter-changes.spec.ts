import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse, sentinel1Page } from 'e2e/helpers';

test('Baseline: Cancel restores filter changes after editing start date', async ({
  page,
}) => {
  await sentinel1Page(page);

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();

  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1A_IW_SLC__1SDV_20180616T210817_20180616T210845_022387_026C91_EDAA',
    );

  const initialSearch = waitForASFAPIResponse(page);
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();
  await initialSearch;

  const baselineCriteriaButton = page.getByRole('radio', {
    name: 'Baseline Criteria',
  });
  await baselineCriteriaButton.click();

  const startDate = page
    .locator('app-baseline-filters')
    .getByRole('textbox', { name: 'Start Date' });

  await startDate.fill('9/1/2018');
  await expect(startDate).toHaveValue('9/1/2018');

  await page
    .locator('app-cancel-filter-changes')
    .getByRole('button', { name: 'Cancel' })
    .click();

  await baselineCriteriaButton.click();
  await expect(startDate).toHaveValue('');
});
