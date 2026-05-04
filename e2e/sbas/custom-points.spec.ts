import { test, expect } from '@e2e/fixtures';

test('SBAS Manually Add Point', async ({ page }) => {
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
  await page
    .getByText('Cancel SEARCH arrow_drop_down')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page
    .getByText('add_circlestop_circleremove_circle')
    .getByText('add_circle')
    .click();
  await page.waitForTimeout(500);
  await page.locator('circle').nth(3).click();
  await page.locator('circle:nth-child(26)').click({ force: true });
  await page.waitForTimeout(500);

  await page
    .locator('cdk-virtual-scroll-viewport')
    .evaluate((e) => (e.scrollTop += 10000));

  await expect(page.locator('cdk-virtual-scroll-viewport')).toContainText(
    'Jan 13 2017 to May 08',
  );
});
