import { test, expect } from '@playwright/test';

test('Results Menu Export CSV', async ({ page }) => {
  page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();
  await page.getByRole('region', { name: 'Scene' }).getByLabel('Scene').click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_IW_SLC__1SDV_20210128T101605_20210128T101636_025353_030505_9FF1',
    );
  await page
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page.locator('#mat-button-toggle-13-button').click();
  await page.waitForTimeout(1500);
  await page.mouse.move(800, 600);
  await expect(page.locator('app-map-info')).toContainText('lat -20.');
  await expect(page.locator('app-map-info')).toContainText('lon -72.');
});
