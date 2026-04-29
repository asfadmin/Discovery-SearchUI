import { test, expect } from '@playwright/test';

test('Files: Add to On Demand Queue', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');
  const insarGammaFile = page
    .locator('#event-selection-list mat-list-option')
    .filter({ hasText: 'INSAR GAMMA' })
    .first();
  const onDemandButton = insarGammaFile.locator('button[mat-icon-button]').first();
  const insarGammaMenuItem = page.getByRole('menuitem', {
    name: /InSAR GAMMA/i,
  });
  const addJobMenuItem = page.getByRole('menuitem', {
    name: /Add 1 .* (Pair|Job)/i,
  });
  const onDemandHeaderButton = page.getByRole('button', { name: 'ON DEMAND' });

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
  await expect(insarGammaFile).toBeVisible();
  await insarGammaFile.scrollIntoViewIfNeeded();

  await onDemandButton.click();
  await expect(insarGammaMenuItem).toBeVisible();
  await insarGammaMenuItem.click();
  await expect(addJobMenuItem).toBeVisible();
  await addJobMenuItem.click();

  await onDemandHeaderButton.click();
  await page.getByRole('menuitem', { name: 'On Demand Queue' }).click();

  await expect(page.locator('.processing-queue')).toBeVisible();
  await expect(page.locator('.job-type--button')).toContainText('InSAR GAMMA');
  await expect(page.locator('app-processing-queue-jobs mat-list-item')).toHaveCount(
    1,
  );
});
