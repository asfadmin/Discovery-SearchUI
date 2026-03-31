import { test, expect } from '@playwright/test';

test('Add files to Download Queue', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();
  await page.getByRole('region', { name: 'Scene' }).getByLabel('Scene').click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('R1_65192_ST6_F111');
  await page
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page.locator('#mat-button-toggle-14-button').click();
  await page
    .getByRole('menuitem', { name: 'Add 41 Files to downloads' })
    .click();
  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.getByText('Files, 6.94 GB')).toContainText('41');
});
