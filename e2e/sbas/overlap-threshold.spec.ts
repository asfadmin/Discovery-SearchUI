import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('SBAS overlap threshold filter changes the selected value', async ({
  page,
}) => {
  await sentinel1Page(page);

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1A_IW_SLC__1SDV_20210920T235648_20210920T235715_039772_04B42F_3C60',
    );
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
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
