import { test, expect } from 'e2e/pages/search.page';

test('SBAS overlap threshold filter changes the selected value', async ({
  page: capturedSearchPage,
}) => {
  await capturedSearchPage
    .getByRole('button', { name: 'Geographic Search' })
    .click();
  await capturedSearchPage
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await capturedSearchPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1A_IW_SLC__1SDV_20210920T235648_20210920T235715_039772_04B42F_3C60',
    );
  await capturedSearchPage
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  await capturedSearchPage
    .locator('mat-button-toggle')
    .filter({ hasText: 'SBAS Filters' })
    .click();

  await expect(
    capturedSearchPage.locator('app-sbas-overlap-selector'),
  ).toContainText('50% Overlap Threshold');

  const headerBefore = await capturedSearchPage
    .locator('app-scenes-list-header')
    .textContent();

  await capturedSearchPage
    .locator('app-sbas-overlap-selector mat-select')
    .click();
  await capturedSearchPage
    .getByRole('option', { name: 'Any Overlap Threshold' })
    .click();

  await expect(
    capturedSearchPage.locator('app-sbas-overlap-selector'),
  ).toContainText('Any Overlap Threshold');
  await expect(
    capturedSearchPage.locator('app-scenes-list-header'),
  ).not.toHaveText(headerBefore ?? '');
});
