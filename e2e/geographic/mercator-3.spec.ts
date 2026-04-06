import { test, expect } from '@playwright/test';

const WKT_POLYGON =
  'POLYGON((150.2848 62.3432,262.0137 62.3432,262.0137 65.8193,150.2848 65.8193,150.2848 62.3432))';

test('Bounding box polygon is preserved after search in Mercator projection', async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto('/');

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'Sentinel-1 Sentinel-1' }).click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();

  const filtersPanel = page.locator('.dataset-filters-div');
  const aoiInput = filtersPanel.getByLabel('Area of Interest • WKT');
  await aoiInput.click();
  await aoiInput.fill(WKT_POLYGON);

  await filtersPanel.getByLabel('Start Date').click();
  await filtersPanel.getByLabel('Start Date').fill('1/1/22');
  await filtersPanel.getByLabel('End Date').click();
  await filtersPanel.getByLabel('End Date').fill('8/25/2022');

  const searchResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('output=jsonlite2') &&
      response.status() === 200,
  );
  await filtersPanel.getByRole('button', { name: 'SEARCH' }).click();
  const searchResponse = await searchResponsePromise;

  const requestUrl = searchResponse.url();
  expect(requestUrl).toContain('bbox=150.2848');
  expect(requestUrl).toContain('start=2022-01-01');
  expect(requestUrl).toContain('end=2022-08-2');

  const firstResult = page
    .getByRole('button', { name: /S1A_IW_GRDH.*2022/ })
    .first();
  await expect(firstResult).toBeVisible({ timeout: 30000 });
  await firstResult.click();

  await expect(page.locator('input[name="searchPolygon"]')).toHaveValue(
    WKT_POLYGON,
  );
});
