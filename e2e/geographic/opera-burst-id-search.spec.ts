import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Opera Burst ID search returns matching results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'OPERA-S1 Sentinel-1 RTC' }).click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByLabel('Opera Burst ID')
    .fill('T137_292392_IW1,T064_135590_IW1');

  const responsePromise = waitForASFAPIResponse(page);
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await expect(page.locator('app-info-bar')).toContainText(
    'Opera Burst IDs: T137_292392_IW1, T064_135590_IW1',
  );
  await expect(page.locator('mat-card-header').first()).toContainText(
    'T137-292392-IW1',
  );
});
