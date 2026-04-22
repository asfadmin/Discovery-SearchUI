import { test, expect } from '@playwright/test';

test('Delete files from Download Queue', async ({ page }) => {
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
    .getByText('Cancel SEARCH arrow_drop_down')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page
    .locator('app-scenes-list-header')
    .getByRole('radiogroup')
    .filter({ hasText: 'add_shopping_cart' })
    .click();
  await page
    .getByRole('menuitem', { name: 'Add 41 Files to downloads' })
    .click();
  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText('41 Files');

  await page
    .locator('mat-list-item')
    .first()
    .locator('button.close-button')
    .click();
  await page
    .locator('mat-list-item')
    .first()
    .locator('button.close-button')
    .click();

  await expect(page.locator('.dl-subtitle')).toContainText('39 Files');
});
