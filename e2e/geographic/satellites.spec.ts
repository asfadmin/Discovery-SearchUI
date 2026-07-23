import { test, expect } from 'e2e/fixtures';

import { standardizedPage } from 'e2e/helpers';

test('Sentinel Satellite Filter', async ({ page }) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const subtypeFilter = page.getByRole('combobox', { name: 'Satellite' });
  await subtypeFilter.click();
  await page.getByRole('option', { name: 'Sentinel-1C' }).click();
  await expect(page.locator('app-info-bar')).toContainText('Satellites: SC');
});
