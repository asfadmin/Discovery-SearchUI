import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('SBAS: Search for a Scene from Geo Search', async ({ page }) => {
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill('POINT(-166.6953 53.8476)');
  await page
    .locator('app-filters-dropdown')
    .getByRole('combobox', { name: 'File Type' })
    .click();
  await page
    .getByRole('option', { name: 'L1 Single Look Complex (SLC)' })
    .click();
  await page.locator('.cdk-overlay-backdrop').click();
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  await page.locator('app-scene').first().click();

  const sbasSearch = waitForASFAPIResponse(page);
  await page.getByRole('button', { name: 'SBAS', exact: true }).click();
  await sbasSearch;

  await expect(page.locator('app-scenes-list-header')).toContainText('Pairs');
});
