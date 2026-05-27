import { test, expect } from 'e2e/fixtures';

test('Files: Add to On Demand Queue', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  await page
    .locator('app-sarviews-header')
    .getByRole('combobox', { name: 'Event Search' })
    .fill('Central Alaska');
  await page.getByRole('option', { name: /Central Alaska/i }).first().click();
  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.locator('.product-list-header')).toContainText('Files');

  const insarGammaFile = page
    .locator('#event-selection-list mat-list-option')
    .filter({ hasText: 'INSAR GAMMA' })
    .first();
  await expect(insarGammaFile).toBeVisible();
  await insarGammaFile.scrollIntoViewIfNeeded();

  await insarGammaFile.locator('button[mat-icon-button]').first().click();

  const insarGammaMenuItem = page.getByRole('menuitem', {
    name: /InSAR GAMMA/i,
  });
  const addJobMenuItem = page.getByRole('menuitem', {
    name: /Add 1 .* (Pair|Job)/i,
  });

  await insarGammaMenuItem.click();
  await addJobMenuItem.click();

  await page.getByRole('button', { name: 'ON DEMAND' }).click();
  await page.getByRole('menuitem', { name: 'On Demand Queue' }).click();

  await expect(page.locator('.processing-queue')).toBeVisible();
  await expect(page.locator('.job-type--button')).toContainText('InSAR GAMMA');
  await expect(page.locator('app-processing-queue-jobs mat-list-item')).toHaveCount(
    1,
  );
});
