import { test, expect } from 'e2e/fixtures';

test('SBAS: Search after geo search', async ({ page }) => {
  await page.goto('/?maxResults=1');

  await page
    .locator('#mat-button-toggle-8-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.getByText('Sentinel-1 • C-Band')).toBeVisible();
  await page.getByRole('button', { name: 'Geographic Search' }).click();

  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();

  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
    );

  await page
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText(
    '599 Pairs',
  );
});
