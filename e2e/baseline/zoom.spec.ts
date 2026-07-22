import { test, expect } from 'e2e/pages/search.page';

test('Baseline zoom to results', async ({ capturedSearchPage }) => {
  const getMapInfoText = async () =>
    ((await capturedSearchPage.locator('app-map-info').textContent()) ?? '')
      .replace(/\s+/g, ' ')
      .trim();

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
  await capturedSearchPage
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  const urlBeforeZoom = capturedSearchPage.url();

  await capturedSearchPage
    .getByRole('radiogroup')
    .filter({ hasText: 'settings_overscan' })
    .click();

  await expect.poll(() => capturedSearchPage.url()).not.toBe(urlBeforeZoom);

  await capturedSearchPage.mouse.move(800, 600);
  await expect.poll(async () => await getMapInfoText()).toMatch(/lat.*lon/i);
  const coordsBeforeMove = await getMapInfoText();

  await capturedSearchPage.mouse.move(900, 600);
  await expect
    .poll(async () => await getMapInfoText())
    .not.toBe(coordsBeforeMove);
});
