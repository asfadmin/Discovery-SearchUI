import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('S1 Burst path filter returns matching results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'S1 Burst' }).click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByPlaceholder('Path Start').fill('86');
  await page.getByPlaceholder('Path End').fill('86');

  const responsePromise = waitForASFAPIResponse(page);
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await expect(page.locator('app-info-bar')).toContainText('Path : 86 - 86');
  await expect(page.locator('mat-card-header').first()).toBeVisible();
});
