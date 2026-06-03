import { test, expect } from 'e2e/fixtures';

test('SBAS Download Pair CSV', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_WV_SLC__1SSV_20200720T132328_20200720T135106_022555_02ACF6_F823',
    );
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('radiogroup').filter({ hasText: 'get_app' }).click();
  const download = await downloadPromise;
  await download.path();

  await expect(page).toHaveScreenshot();
});
