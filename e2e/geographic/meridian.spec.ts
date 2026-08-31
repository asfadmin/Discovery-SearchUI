import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('Anti-Meridian Granules', async ({ page }) => {
  await sentinel1Page(page);

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ALOS AVNIR-2 Advanced Visible' })
    .click();
  const dateFilters = page.getByRole('region', {
    name: 'Date Filters Documentation',
  });

  await dateFilters
    .getByRole('textbox', { name: 'Start Date' })
    .fill('4/30/2010');
  await dateFilters.getByRole('textbox', { name: 'End Date' }).fill('7/3/2010');
  await page
    .locator('app-dataset-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page
    .getByRole('button', { name: 'ALAV2A236613470 July 4, 2010' })
    .click();
  await expect(page.locator('mat-card-title')).toContainText('ALAV2A236613470');
});
