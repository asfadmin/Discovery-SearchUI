import { test, expect } from 'e2e/fixtures';

test('ALOS example search opens matching result', async ({ page }) => {
  await page.goto('/');
  const datasetHeader = page.locator('app-dataset-header');

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ALOS AVNIR-2 Advanced Visible' })
    .click();
  await datasetHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page.getByRole('button', { name: 'ALAV2A279162270 April 21,' }).click();
  await expect(page.locator('mat-card-title')).toContainText('ALAV2A279162270');
});
