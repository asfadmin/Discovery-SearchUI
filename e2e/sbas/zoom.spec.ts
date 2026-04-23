import { test, expect } from '@playwright/test';

test('SBAS: Zoom to Results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1A_IW_SLC__1SDV_20211207T200157_20211207T200224_040907_04DB95_6CE9');
  await page
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await page
    .getByRole('radiogroup')
    .filter({ hasText: 'settings_overscan' })
    .click();
  await page.mouse.move(800, 600);

  await expect(page.locator('app-map-info')).toContainText('lat ');
  await expect(page.locator('app-map-info')).toContainText('lon ');
});
