import { test, expect } from '@playwright/test';

test('SBAS overlap threshold filter changes the selected value', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page.getByRole('menuitem', { name: 'SBAS SBAS search' }).click();
  await page.getByRole('region', { name: 'Scene' }).getByLabel('Scene').click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1A_IW_SLC__1SDV_20210920T235648_20210920T235715_039772_04B42F_3C60');
  await page
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await page
    .locator('mat-button-toggle')
    .filter({ hasText: 'SBAS Filters' })
    .click();
  await page.locator('app-sbas-overlap-selector mat-select').click();
  await page.getByRole('option', { name: 'Any Overlap Threshold' }).click();

  await expect(page.locator('app-sbas-overlap-selector')).toContainText(
    'Any Overlap Threshold',
  );
});
