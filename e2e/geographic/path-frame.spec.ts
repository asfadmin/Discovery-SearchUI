import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('Button to clear path/frame', async ({ page }) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'POLYGON((-77.0154 60.4785,-41.9471 60.4785,-41.9471 66.9125,-77.0154 66.9125,-77.0154 60.4785))',
    );
  await page.getByPlaceholder('Path Start').click();
  await page.getByPlaceholder('Path Start').fill('20');
  await page.getByPlaceholder('Path End').click();
  await page.getByPlaceholder('Path End').fill('25');
  await page.getByPlaceholder('Frame Start').click();
  await page.getByPlaceholder('Frame Start').fill('5');
  await page.getByPlaceholder('Frame End').click();
  await page.getByPlaceholder('Frame End').fill('10');
  await expect(page.locator('app-info-bar')).toContainText(
    'Path : 20 - 25 Frame: 5 - 10',
  );
  await page.getByRole('button', { name: 'Clear Path / Frame' }).click();
  await expect(page.locator('app-info-bar')).toContainText('');
});

test('Button to restore path/frame', async ({ page }) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'LINESTRING(-75.673828 34.524661,-80.859375 30.751278,-79.716797 25.799891)',
    );
  await page.getByPlaceholder('Path Start').click();
  await page.getByPlaceholder('Path Start').fill('1');

  await page.getByRole('button', { name: 'Clear Area Of Interest' }).click();
  let aoiValue = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();

  await expect(aoiValue).toContain('');
  await page.getByRole('button', { name: 'Restore Area' }).click();
  aoiValue = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(aoiValue).toContain(
    'LINESTRING(-75.6738 34.5247,-80.8594 30.7513,-79.7168 25.7999)',
  );
  const searchActionsButton = page
    .locator('.dataset-filters-card .footer')
    .locator('app-search-button')
    .locator('.arrow-button-toggle');
  await searchActionsButton.click();
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'LINESTRING(-75.673828 34.524661,-80.859375 30.751278,-79.716797 25.799891)',
    );
  await page.getByPlaceholder('Frame Start').click();
  await page.getByPlaceholder('Frame Start').fill('6');
  await page.getByRole('button', { name: 'Clear Area Of Interest' }).click();
  aoiValue = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(aoiValue).toContain('');
  await page.getByRole('button', { name: 'Restore Area' }).click();
  aoiValue = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(aoiValue).toContain(
    'LINESTRING(-75.6738 34.5247,-80.8594 30.7513,-79.7168 25.7999)',
  );
});
