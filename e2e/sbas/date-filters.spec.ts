import { test, expect } from '@playwright/test';

test('SBAS Start & End Date Filters', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1A_IW_SLC__1SDV_20180616T210817_20180616T210845_022387_026C91_EDAA');
  await page
    .getByText('Cancel SEARCH arrow_drop_down')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  const sbasFiltersButton = page
    .locator('mat-button-toggle')
    .filter({ hasText: 'SBAS Filters' });
  await expect(sbasFiltersButton).toBeVisible();
  await sbasFiltersButton.click({ force: true });

  await page.getByRole('textbox', { name: 'Start Date' }).fill('9/1/2018');
  await page.getByRole('textbox', { name: 'End Date' }).fill('11/1/2020');
  await page.keyboard.press('Tab');

  await expect(page.locator('app-scenes-list-header')).toContainText(
    '67 Pairs',
  );
});
