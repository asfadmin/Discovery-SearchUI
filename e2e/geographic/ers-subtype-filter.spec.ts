import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('ERS subtype E2 filter returns matching results', async ({ page }) => {
  const filtersDropdown = page.locator('app-filters-dropdown');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ERS Primarily SAR imagery' })
    .click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.getByText('satellites selected')).toContainText(
    '0/2 satellites selected',
  );

  await page.getByText('Satellite', { exact: true }).click();
  await page.getByRole('option', { name: 'ERS-2' }).click();
  await page.keyboard.press('Escape');

  const responsePromise = waitForASFAPIResponse(page);
  await filtersDropdown
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await expect(page.locator('app-info-bar')).toContainText('Satellites: E2');
  await expect(page.locator('mat-card-header')).toContainText('E2');
});
