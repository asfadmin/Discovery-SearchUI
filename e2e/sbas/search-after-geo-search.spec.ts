import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('SBAS: Search after geo search', async ({ page }) => {
  await page.route('*/**/services/search/param**', async (route) => {
    if (route.request().url().includes('COUNT')) {
      await route.continue();
    } else {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: { report: 'some message' } }),
      });
    }
  });
  await standardizedPage(page);

  await page.getByRole('button', { name: 'SEARCH', exact: true }).click();
  await expect(page.getByLabel('Search Error')).toBeVisible();

  await page.unroute('**/services/search/param**');

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
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  await expect(page.getByText('Pairs info')).toBeVisible();
});
