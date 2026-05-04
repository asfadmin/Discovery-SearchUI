import { test, expect } from '../fixtures';

test('Anti-Meridian Granules', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ALOS AVNIR-2 Advanced Visible' })
    .click();
  await page
    .locator('div')
    .filter({ hasText: 'Search Type Geographic Search' })
    .getByText('Start Date')
    .nth(0)
    .click();
  await page.locator('#mat-input-10').fill('4/30/2010');
  await page
    .locator('div')
    .filter({ hasText: 'Search Type Geographic Search' })
    .getByText('End Date')
    .nth(0)
    .click();
  await page.locator('#mat-input-11').fill('7/3/2010');
  await page
    .locator('#mat-button-toggle-8-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page
    .getByRole('button', { name: 'ALAV2A236613470 July 4, 2010' })
    .click();
  await expect(page.locator('mat-card-title')).toContainText('ALAV2A236613470');
});
