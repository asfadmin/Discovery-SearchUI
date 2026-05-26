import { test, expect } from 'e2e/fixtures';

test('Baseline zoom to results', async ({ page }) => {
  const getMapInfoText = async () =>
    ((await page.locator('app-map-info').textContent()) ?? '')
      .replace(/\s+/g, ' ')
      .trim();

  await page.goto('/');
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
  const footerSearchButton = page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' });
  await expect(footerSearchButton).toContainText('SEARCH');
  await expect(footerSearchButton).toBeEnabled();
  await footerSearchButton.click();

  const urlBeforeZoom = page.url();

  await page
    .getByRole('radiogroup')
    .filter({ hasText: 'settings_overscan' })
    .click();

  await expect.poll(() => page.url()).not.toBe(urlBeforeZoom);

  await page.mouse.move(800, 600);
  await expect.poll(async () => await getMapInfoText()).toMatch(/lat.*lon/i);
  const coordsBeforeMove = await getMapInfoText();

  await page.mouse.move(900, 600);
  await expect
    .poll(async () => await getMapInfoText())
    .not.toBe(coordsBeforeMove);
});
