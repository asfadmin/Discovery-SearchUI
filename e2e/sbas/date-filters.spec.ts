import { test, expect } from '@playwright/test';

test('SBAS Start & End Date Filters', async ({ page }) => {
  await page.goto('/');
  const baselineHeader = page.locator('app-baseline-header');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1A_IW_SLC__1SDV_20180616T210817_20180616T210845_022387_026C91_EDAA');
  await baselineHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await page
    .locator('app-sbas-results-menu')
    .locator('mat-button-toggle')
    .filter({ hasText: 'SBAS Filters' })
    .click();

  await page.getByRole('textbox', { name: 'Start Date' }).fill('9/1/2018');
  await page.getByRole('textbox', { name: 'End Date' }).fill('11/1/2020');
  await page.keyboard.press('Tab');

  await expect(page.locator('app-scenes-list-header')).toContainText(
    '67 Pairs',
  );
});
