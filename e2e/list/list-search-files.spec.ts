import { test, expect } from 'e2e/pages/search.page';
import { waitForASFAPIResponse } from 'e2e/helpers';

test(
  'List Search: searching by file IDs returns scenes',
  { tag: '@visual' },
  async ({ capturedSearchPage }) => {
    await capturedSearchPage.goto('/?maxResults=10');

    await capturedSearchPage
      .locator('app-search-type-selector')
      .locator('button.button-menu-trigger')
      .click();
    await expect(capturedSearchPage).toHaveScreenshot();

    await capturedSearchPage.getByText('List', { exact: true }).click();

    await capturedSearchPage
      .locator('app-list-header')
      .getByRole('button', { name: 'Edit List' })
      .click();

    await capturedSearchPage
      .locator('app-list-filters')
      .getByRole('radio', { name: 'File', exact: true })
      .click();
    await expect(capturedSearchPage).toHaveScreenshot();

    await capturedSearchPage
      .getByPlaceholder('List of File IDs')
      .fill(
        [
          'S1C_IW_RAW__0SDV_20260512T032011_20260512T032043_007615_00F774_B7C5-RAW',
          'S1C_IW_RAW__0SDV_20260512T032011_20260512T032043_007615_00F774_B7C5-SLC',
          'S1C_IW_RAW__0SDV_20260512T032011_20260512T032043_007615_00F774_B7C5-GRD_HD',
        ].join('\n'),
      );

    const searchResponse = waitForASFAPIResponse(capturedSearchPage);
    const searchButton = capturedSearchPage
      .locator('app-filters-dropdown')
      .locator('app-search-button');

    await searchButton.getByRole('button', { name: 'SEARCH' }).click();
    await searchResponse;

    await expect(searchButton).not.toContainText('NO RESULTS');
    await expect(
      capturedSearchPage.locator('app-max-results-selector'),
    ).toContainText(/\d+\s+Files?/i);
  },
);
