import { test, expect } from 'e2e/fixtures';

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

  const addToDownloadsMenuItem = page.getByRole('menuitem', {
    name: /Add \d+ Files to downloads/,
  });
  const menuText = (await addToDownloadsMenuItem.textContent()) ?? '';
  const fileCount = Number(
    menuText.match(/Add (\d+) Files to downloads/i)?.[1] ?? 0,
  );

  expect(fileCount).toBeGreaterThan(0);

  await addToDownloadsMenuItem.click();
  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText(
    `${fileCount} Files`,
  );
  await expect(
    page.locator('.dl-mat-dialog-content mat-list-item'),
  ).toHaveCount(fileCount);
});
