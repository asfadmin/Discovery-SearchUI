import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('List Search: searching by file IDs returns scenes', async ({ page }) => {
  await page.goto('/?maxResults=10');

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
    .locator('app-list-filters')
    .getByRole('radio', { name: 'File', exact: true })
    .click();

  await page.getByPlaceholder('List of File IDs').fill(
    [
      'S1C_IW_RAW__0SDV_20260512T032011_20260512T032043_007615_00F774_B7C5-RAW',
      'S1C_IW_RAW__0SDV_20260512T032011_20260512T032043_007615_00F774_B7C5-SLC',
      'S1C_IW_RAW__0SDV_20260512T032011_20260512T032043_007615_00F774_B7C5-GRD_HD',
    ].join('\n'),
  );

  const searchResponse = waitForASFAPIResponse(page);
  const searchButton = page.locator('app-search-button').last();

  await searchButton.getByRole('button', { name: 'SEARCH' }).click();
  await searchResponse;

  await expect(searchButton).not.toContainText('NO RESULTS');
  await expect(page.locator('app-max-results-selector')).toContainText(
    /\d+\s+Files?/i,
  );
});
