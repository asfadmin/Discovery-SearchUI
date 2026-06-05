import { test, expect } from 'e2e/pages/search.page';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

test('SBAS Download Pair CSV', async ({ capturedSearchPage }) => {
  await capturedSearchPage.goto('/');
  await capturedSearchPage
    .getByRole('button', { name: 'Geographic Search' })
    .click();
  await capturedSearchPage
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await capturedSearchPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_WV_SLC__1SSV_20200720T132328_20200720T135106_022555_02ACF6_F823',
    );
  await capturedSearchPage
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();
  const downloadPromise = capturedSearchPage.waitForEvent('download');
  await capturedSearchPage
    .getByRole('radiogroup')
    .filter({ hasText: 'get_app' })
    .click();
  const download = await downloadPromise;
  const path = await download.path();
  const records = parse(fs.readFileSync(path), {
    columns: true,
    skip_empty_lines: true,
  });

  expect(records[1]).not.toBe('');
  await expect(capturedSearchPage).toHaveScreenshot();
});
