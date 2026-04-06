import { test, expect } from '@playwright/test';
import { waitForASFAPIResponse } from '../helpers';

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

  const aoiRegion = page.getByRole('region', {
    name: 'Area of Interest Options',
  });
  const aoiInput = aoiRegion.getByLabel('Area of Interest • WKT');
  await aoiInput.click();
  await aoiInput.fill(WKT_POLYGON);

  const dateRegion = page.getByRole('region', {
    name: 'Date Filters Documentation',
  });
  await dateRegion.getByLabel('Start Date').click();
  await dateRegion.getByLabel('Start Date').fill('1/1/22');
  await dateRegion.getByLabel('End Date').click();
  await dateRegion.getByLabel('End Date').fill('8/25/2022');

  await page.screenshot({ path: 'test-results/debug-before-search.png' });

  const searchButtons = page.getByRole('button', { name: 'SEARCH' });
  const count = await searchButtons.count();
  console.log(`Found ${count} SEARCH buttons`);
  for (let i = 0; i < count; i++) {
    const btn = searchButtons.nth(i);
    const visible = await btn.isVisible();
    const disabled = await btn.isDisabled();
    console.log(`Button ${i}: visible=${visible}, disabled=${disabled}`);
  }

  const searchResponsePromise = waitForASFAPIResponse(page);
  await searchButtons.first().click();
  await searchResponsePromise;

  const resultsList = page.getByRole('list').filter({ hasText: 'S1A_IW_GRDH' });
  await expect(resultsList.getByRole('button').first()).toBeVisible({
    timeout: 30000,
  });
  await resultsList.getByRole('button').first().click();

  await expect(aoiInput).toHaveValue(WKT_POLYGON);
});
