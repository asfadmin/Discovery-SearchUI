import { test, expect } from 'e2e/fixtures';

test('SBAS Manually Add Point', async ({ page }) => {
  const readPairCount = async () => {
    const headerText = await page.locator('app-scenes-list-header').innerText();
    return Number.parseInt(
      headerText.match(/(\d+)\s+Pairs?/i)?.[1] || '0',
      10,
    );
  };

  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await page.getByRole('region', { name: 'Scene' }).getByLabel('Scene').click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_WV_SLC__1SSV_20200720T132328_20200720T135106_022555_02ACF6_F823',
    );
  const footerSearchButton = page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' });
  await expect(footerSearchButton).toContainText('SEARCH');
  await expect(footerSearchButton).toBeEnabled();
  await footerSearchButton.click();

  const scenesListHeader = page.locator('app-scenes-list-header');
  await expect(scenesListHeader).toContainText(/\d+\s+Pairs?/i);
  await expect.poll(async () => readPairCount()).toBeGreaterThan(0);
  const initialPairCount = await readPairCount();

  await page
    .locator('.sbas-ribbon-group .control-mat-button-toggle')
    .first()
    .click();
  await page.waitForTimeout(500);
  await page.locator('circle').nth(3).click();
  await page.locator('circle:nth-child(26)').click({ force: true });
  await expect
    .poll(async () => readPairCount())
    .toBe(initialPairCount + 1);
  await expect(page.locator('cdk-virtual-scroll-viewport')).toContainText(
    /\w{3}\s+\d{2}\s+\d{4}\s+to\s+\w{3}\s+\d{2}/,
  );
});
