import { test, expect } from 'e2e/pages/search.page';

test('SBAS: Zoom to Results', async ({ page: capturedSearchPage }) => {
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
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  const urlBeforeZoom = capturedSearchPage.url();

  await capturedSearchPage
    .getByRole('radiogroup')
    .filter({ hasText: 'settings_overscan' })
    .click();

  await expect.poll(() => capturedSearchPage.url()).not.toBe(urlBeforeZoom);

  await capturedSearchPage.mouse.move(400, 300);
  await expect(capturedSearchPage.locator('app-map-info')).not.toContainText(
    'lat 00.0°',
  );

  const coordsAtFirstPosition = await capturedSearchPage
    .locator('app-map-info')
    .textContent();

  await capturedSearchPage.mouse.move(800, 600);
  await expect
    .poll(
      async () =>
        await capturedSearchPage.locator('app-map-info').textContent(),
    )
    .not.toBe(coordsAtFirstPosition);
});
