import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse, sentinel1Page } from 'e2e/helpers';

test('S1 Burst ID filter returns matching results', async ({ page }) => {
  await sentinel1Page(page);

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'S1 Burst' }).click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByLabel('Full Burst ID').fill('088_187244_IW3');

  const responsePromise = waitForASFAPIResponse(page);
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await expect(page.locator('app-info-bar')).toContainText(
    'Full Burst ID: 088_187244_IW3',
  );
  await expect(page.locator('mat-card-header').first()).toContainText(
    'S1_187244_IW3_',
  );
});
