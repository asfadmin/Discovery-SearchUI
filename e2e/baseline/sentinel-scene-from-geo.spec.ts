import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse, standardizedPage } from 'e2e/helpers';

test('Baseline: Search for a Sentinel Scene from Geo Search (SLC File)', async ({
  page,
}) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'End Date' })
    .first()
    .fill('1/1/2020');
  await page.keyboard.press('Tab');

  const initialSearch = waitForASFAPIResponse(page);
  await page
    .getByText('Cancel SEARCH arrow_drop_down')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await initialSearch;

  await page.locator('app-scene').first().click();

  const baselineSearch = waitForASFAPIResponse(page);
  await page.getByRole('button', { name: 'Baseline', exact: true }).click();
  await baselineSearch;

  await expect(
    page
      .locator('a[href="https://asf.alaska.edu/datasets/daac/sentinel-1/"]')
      .first(),
  ).toContainText('Sentinel-1');
});
