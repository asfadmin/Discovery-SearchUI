import { test, expect } from '@playwright/test';

test('SBAS: Pair Count Tooltip', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1A_IW_SLC__1SDV_20230725T160026_20230725T160053_049582_05F648_079A');
  await page
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await page.locator('.sbas-count-tooltip').hover();

  await expect(page.locator('.mdc-tooltip__surface')).toContainText(
    'Applied filters may reduce the number of pairs listed below',
  );
});
