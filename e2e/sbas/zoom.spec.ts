import { test, expect } from 'e2e/fixtures';

test('SBAS: Zoom to Results', async ({ page }) => {
  await page.goto('/');
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
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  const urlBeforeZoom = page.url();

  await page
    .getByRole('radiogroup')
    .filter({ hasText: 'settings_overscan' })
    .click();

  await expect.poll(() => page.url()).not.toBe(urlBeforeZoom);

  await page.mouse.move(400, 300);
  await expect(page.locator('app-map-info')).not.toContainText('lat 00.0°');

  const coordsAtFirstPosition = await page
    .locator('app-map-info')
    .textContent();

  await page.mouse.move(800, 600);
  await expect
    .poll(async () => await page.locator('app-map-info').textContent())
    .not.toBe(coordsAtFirstPosition);
});
