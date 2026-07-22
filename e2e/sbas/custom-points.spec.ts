import { test, expect } from 'e2e/pages/search.page';

test('SBAS Manually Add Point', async ({ page: capturedSearchPage }) => {
  await capturedSearchPage
    .getByRole('button', { name: 'Geographic Search' })
    .click();
  await capturedSearchPage
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await capturedSearchPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .click();
  await capturedSearchPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_WV_SLC__1SSV_20200720T132328_20200720T135106_022555_02ACF6_F823',
    );
  await capturedSearchPage
    .getByText('Cancel SEARCH arrow_drop_down')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await capturedSearchPage
    .getByText('add_circlestop_circleremove_circle')
    .getByText('add_circle')
    .click();
  await capturedSearchPage.waitForTimeout(500);
  await capturedSearchPage.locator('circle').nth(3).click();
  await capturedSearchPage
    .locator('circle:nth-child(26)')
    .click({ force: true });
  await capturedSearchPage.waitForTimeout(500);

  await capturedSearchPage
    .locator('cdk-virtual-scroll-viewport')
    .evaluate((e) => (e.scrollTop += 10000));

  await expect(
    capturedSearchPage.locator('cdk-virtual-scroll-viewport'),
  ).toContainText('Jan 13 2017 to May 08');
});
