import { test, expect } from 'e2e/pages/search.page';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

test(
  'Results Menu Export CSV',
  { tag: '@visual' },
  async ({ capturedSearchPage }) => {
    await capturedSearchPage.goto('/');
    await capturedSearchPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();
    await capturedSearchPage
      .getByRole('menuitem', { name: 'Baseline Baseline search' })
      .click();

    await capturedSearchPage
      .getByRole('region', { name: 'Scene' })
      .getByLabel('Scene')
      .click();
    await capturedSearchPage
      .getByRole('region', { name: 'Scene' })
      .getByLabel('Scene')
      .fill(
        'S1B_IW_SLC__1SDV_20210128T101605_20210128T101636_025353_030505_9FF1',
      );
    await expect(capturedSearchPage).toHaveScreenshot();

    await capturedSearchPage
      .locator('app-filters-dropdown')
      .getByRole('button', { name: 'Filters panel search button' })
      .click();
    await capturedSearchPage
      .getByRole('radiogroup')
      .filter({ hasText: 'get_app' })
      .click();
    const metadataMenuItem = capturedSearchPage.getByRole('menuitem', {
      name: 'Metadata',
    });
    await metadataMenuItem.click();
    const csvMenuItem = capturedSearchPage.getByRole('menuitem', {
      name: 'csv',
    });
    const downloadPromise = capturedSearchPage.waitForEvent('download');
    await csvMenuItem.click();
    const download = await downloadPromise;
    const path = await download.path();

    const records = parse(fs.readFileSync(path), {
      columns: true,
      skip_empty_lines: true,
    });

    expect(records[1]).not.toBe('');
    await expect(capturedSearchPage).toHaveScreenshot();
  },
);
