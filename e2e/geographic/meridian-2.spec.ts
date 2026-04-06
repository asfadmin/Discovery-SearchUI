import { test, expect } from '@playwright/test';

test('Anti-Meridian Granules', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/');

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'ALOS AVNIR-2' }).click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();

  const filtersPanel = page.locator('.dataset-filters-div');
  await filtersPanel.getByLabel('Start Date').click();
  await filtersPanel.getByLabel('Start Date').fill('4/30/2010');
  await filtersPanel.getByLabel('End Date').click();
  await filtersPanel.getByLabel('End Date').fill('7/3/2010');

  const searchResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('output=jsonlite2') &&
      response.status() === 200,
  );
  await filtersPanel.getByRole('button', { name: 'SEARCH' }).click();
  const searchResponse = await searchResponsePromise;

  const requestUrl = searchResponse.url();
  expect(requestUrl).toContain('start=2010-04-30');
  expect(requestUrl).toContain('end=2010-07-0');

  const firstResult = page
    .getByRole('button', { name: /ALAV2A.*2010/ })
    .first();
  await expect(firstResult).toBeVisible({ timeout: 30000 });
  await expect(page).toHaveScreenshot('meridian-2-search-results.png');

  await firstResult.click();
  await expect(page.locator('mat-card-title')).toContainText('ALAV2A');
  await expect(page).toHaveScreenshot('meridian-2-result-selected.png');
});
