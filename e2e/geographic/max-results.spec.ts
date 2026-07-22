import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Auto Search when max results changes', async ({ page }) => {
  const searchButton = page
    .locator('app-dataset-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });
  const maxResultsSelector = page
    .locator('app-dataset-header')
    .getByRole('button', { name: 'Select max results' });

  await searchButton.click();
  await waitForASFAPIResponse(page);

  await maxResultsSelector.click();

  await page.getByRole('menuitem', { name: '500 Files' }).click();
  await waitForASFAPIResponse(page);

  await expect(
    page.locator('app-dataset-header').locator('app-max-results-selector'),
  ).toContainText('500');
  await expect(page.locator('app-scenes-list-header')).toContainText('500 of');
});
