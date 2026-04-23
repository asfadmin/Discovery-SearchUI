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

  const addMenuItem = page.getByRole('menuitem', {
    name: /Add [1-9]\d* Files to downloads/,
  });
  const menuText = (await addMenuItem.textContent()) ?? '';
  const fileCount = menuText.match(/Add ([1-9]\d*)/)?.[1];
  expect(fileCount).toBeTruthy();
  await addMenuItem.click();

  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText(`${fileCount} Files`);
  await expect(page.locator('.dl-mat-dialog-content mat-list-item')).toHaveCount(
    Number(fileCount),
  );
});
