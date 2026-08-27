import * as fs from 'fs';

import { parse } from 'csv-parse/sync';

import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('Results Menu Export CSV', { tag: '@visual' }, async ({ page }) => {
  await sentinel1Page(page);

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();

  await page.getByRole('region', { name: 'Scene' }).getByLabel('Scene').click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_IW_SLC__1SDV_20210128T101605_20210128T101636_025353_030505_9FF1',
    );
  await expect(page).toHaveScreenshot();

  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();
  await page.getByRole('radiogroup').filter({ hasText: 'get_app' }).click();
  const metadataMenuItem = page.getByRole('menuitem', {
    name: 'Metadata',
  });
  await metadataMenuItem.click();
  const csvMenuItem = page.getByRole('menuitem', {
    name: 'csv',
  });
  await csvMenuItem.click();

  const download = await page.waitForEvent('download');
  const path = await download.path();

  const records = parse(fs.readFileSync(path), {
    columns: true,
    skip_empty_lines: true,
  });

  expect(records[1]).not.toBe('');
  await expect(page).toHaveScreenshot();
});
