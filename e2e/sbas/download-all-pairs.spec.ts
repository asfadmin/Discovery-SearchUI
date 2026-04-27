import { test, expect } from '@playwright/test';

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

  await page
    .getByText('Cancel SEARCH arrow_drop_down')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(
    page.locator('mat-button-toggle').filter({ hasText: 'SBAS Filters' }),
  ).toBeVisible();

  const queueButton = page
    .locator('mat-icon')
    .filter({ hasText: 'add_shopping_cart' })
    .first();
  await expect(queueButton).toBeVisible();
  await queueButton.click({ force: true });

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
