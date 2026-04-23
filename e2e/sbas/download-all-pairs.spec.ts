import { test, expect } from '@playwright/test';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('SBAS: Download All Pairs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1A_IW_SLC__1SDV_20200710T150225_20200710T150252_033394_03DE82_92BB');

  const sbasSearch = waitForASFAPIResponse(page);
  await page
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await sbasSearch;

  await page
    .locator('app-scenes-list-header')
    .getByRole('radiogroup')
    .filter({ hasText: 'add_shopping_cart' })
    .click();
  await page
    .getByRole('menuitem', { name: /Add \d+ Files to downloads/ })
    .click();
  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText('Files');
});
