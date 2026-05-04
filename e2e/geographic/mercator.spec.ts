import { test, expect } from '@e2e/fixtures';

test('Bounding Boxes Return Results in Mercator Projection', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'Sentinel-1 Sentinel-1' }).click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'POLYGON((150.2848 62.3432,262.0137 62.3432,262.0137 65.8193,150.2848 65.8193,150.2848 62.3432))',
    );
  await page
    .getByLabel('Date Filters Documentation')
    .getByText('Start Date')
    .click();
  await page
    .getByRole('region', { name: 'Date Filters Documentation' })
    .getByLabel('Start Date')
    .fill('1/1/22');
  await page
    .getByRole('region', { name: 'Date Filters Documentation' })
    .getByLabel('End Date')
    .click();
  await page
    .getByRole('region', { name: 'Date Filters Documentation' })
    .getByLabel('End Date')
    .click();
  await page
    .getByRole('region', { name: 'Date Filters Documentation' })
    .getByLabel('End Date')
    .fill('8/25/2022');
  await page
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page
    .getByRole('button', {
      name: 'S1A_IW_GRDH_1SDV_20220826T01345… 9CD9 August 26, 2022, 01:34:58Z 0/',
    })
    .click();
  await expect(page.locator('mat-card-title')).toContainText(
    'S1A_IW_GRDH_1SDV_20220826T013458_20220826T013523_044717_0556CA_9CD9',
  );
});
