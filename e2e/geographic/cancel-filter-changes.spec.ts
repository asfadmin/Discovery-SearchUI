import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Geographic: Cancel restores filter changes after editing path range', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'POLYGON((-77.0154 60.4785,-41.9471 60.4785,-41.9471 66.9125,-77.0154 66.9125,-77.0154 60.4785))',
    );

  const initialSearch = waitForASFAPIResponse(page);
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await initialSearch;

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByPlaceholder('Path Start').fill('20');
  await page.getByPlaceholder('Path End').fill('25');

  await expect(page.locator('app-info-bar')).toContainText('Path : 20 - 25');

  await page
    .locator('app-cancel-filter-changes')
    .getByRole('button', { name: 'Cancel' })
    .click();

  await expect(page.locator('app-info-bar')).not.toContainText(
    'Path : 20 - 25',
  );

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.getByPlaceholder('Path Start')).toHaveValue('');
  await expect(page.getByPlaceholder('Path End')).toHaveValue('');
});
