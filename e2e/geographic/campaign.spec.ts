import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Campaign Filter', async ({ page }) => {
  await page.route('**/services/utils/mission_list**', (route) => {
    return route.continue();
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'UAVSAR Uninhabited Aerial' })
    .click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();

  await page
    .getByRole('textbox', { name: 'Filter Campaign' })
    .fill('alaska borehole');
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Alaska borehole sites, AK' })
    .first()
    .click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Campaign: Alaska borehole sites, AK',
  );
});
test('Selecting Multiple Campaigns', async ({ page }) => {
  await page.route('**/services/utils/mission_list**', (route) => {
    return route.continue();
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'UAVSAR Uninhabited Aerial' })
    .click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Filter Campaign' })
    .fill('Aleutians');
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Aleutians, AK' })
    .first()
    .click();
  await page
    .getByRole('textbox', { name: 'Filter Campaign' })
    .fill('alaska borehole');
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Alaska borehole sites, AK' })
    .first()
    .click();
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await waitForASFAPIResponse(page);
  await expect(page.locator('mat-card-title')).toContainText(
    'UA_permaf_20015_15147_009_151005_L090_CX_02',
  );
  await expect(page).toHaveScreenshot();
});
