import { test, expect } from 'e2e/pages/search.page';

test('SBAS: Search after geo search', async ({ page: capturedSearchPage }) => {
  await capturedSearchPage.route(
    '*/**/services/search/param**',
    async (route) => {
      if (route.request().url().includes('COUNT')) {
        await route.continue();
      } else {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: { report: 'some message' } }),
        });
      }
    },
  );

  await capturedSearchPage
    .getByRole('button', { name: 'SEARCH', exact: true })
    .click();
  await expect(capturedSearchPage.getByLabel('Search Error')).toBeVisible();

  await capturedSearchPage.unroute('**/services/search/param**');

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
      'S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
    );

  await capturedSearchPage
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  await expect(capturedSearchPage.getByText('Pairs info')).toBeVisible();
});
