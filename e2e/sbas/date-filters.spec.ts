import { test, expect } from 'e2e/fixtures';

test('SBAS Start & End Date Filters', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1A_IW_SLC__1SDV_20180616T210817_20180616T210845_022387_026C91_EDAA',
    );
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  const sbasFiltersButton = page
    .locator('mat-button-toggle')
    .filter({ hasText: 'SBAS Filters' });
  await sbasFiltersButton.click();

  await page.getByRole('textbox', { name: 'Start Date' }).fill('9/1/2018');
  await page.getByRole('textbox', { name: 'End Date' }).fill('11/1/2020');
  await page.keyboard.press('Tab');

  await expect(page.locator('app-scenes-list-header')).toContainText('67 Pairs');
});
