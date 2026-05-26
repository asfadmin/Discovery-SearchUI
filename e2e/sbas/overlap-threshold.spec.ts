import { test, expect } from 'e2e/fixtures';

test('SBAS overlap threshold filter changes the selected value', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1A_IW_SLC__1SDV_20210920T235648_20210920T235715_039772_04B42F_3C60');
  await page
    .locator('app-baseline-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await page
    .locator('mat-button-toggle')
    .filter({ hasText: 'SBAS Filters' })
    .click();

  await expect(page.locator('app-sbas-overlap-selector')).toContainText(
    '50% Overlap Threshold',
  );

  const headerBefore = await page
    .locator('app-scenes-list-header')
    .textContent();

  await page.locator('app-sbas-overlap-selector mat-select').click();
  await page.getByRole('option', { name: 'Any Overlap Threshold' }).click();

  await expect(page.locator('app-sbas-overlap-selector')).toContainText(
    'Any Overlap Threshold',
  );
  await expect(page.locator('app-scenes-list-header')).not.toHaveText(
    headerBefore ?? '',
  );
});
