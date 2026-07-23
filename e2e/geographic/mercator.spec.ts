import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('Bounding Boxes Return Results in Mercator Projection', async ({
  page,
}) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'Sentinel-1 Sentinel-1' }).click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const aoiOptions = page.getByRole('region', {
    name: 'Area of Interest Options',
  });
  const dateFilters = page.getByRole('region', {
    name: 'Date Filters Documentation',
  });

  await aoiOptions
    .getByLabel('Area of Interest • WKT')
    .fill(
      'POLYGON((150.2848 62.3432,262.0137 62.3432,262.0137 65.8193,150.2848 65.8193,150.2848 62.3432))',
    );
  await dateFilters.getByRole('textbox', { name: 'Start Date' }).fill('1/1/22');
  await dateFilters
    .getByRole('textbox', { name: 'End Date' })
    .fill('8/25/2022');
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
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
