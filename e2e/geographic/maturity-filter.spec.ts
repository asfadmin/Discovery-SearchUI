import { test, expect } from 'e2e/fixtures';
import { nisarPage } from 'e2e/helpers';

test('Data Maturity: Provisional', async ({ page }) => {
  await nisarPage(page);
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Data Maturity$/ })
    .first()
    .click();
  await page.getByText('Provisional').click();
  await page
    .getByRole('textbox', { name: 'Scene Name Patterns' })
    .fill('NISAR_*_X?????_*');
  await expect(
    page
      .locator('app-filters-dropdown')
      .getByRole('button', { name: 'Select max results' }),
  ).toContainText('of 0 Files');
  await expect(page.locator('app-info-bar')).toContainText(
    'Data Maturity: PROVISIONAL',
  );
});

test('Data Maturity: Beta', async ({ page }) => {
  await nisarPage(page);
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Data Maturity$/ })
    .first()
    .click();
  await page.getByText('Beta').click();
  await page
    .getByRole('textbox', { name: 'Scene Name Patterns' })
    .fill('NISAR_*_P?????_*');
  await expect(
    page
      .locator('app-filters-dropdown')
      .getByRole('button', { name: 'Select max results' }),
  ).toContainText('of 12 Files');
  await expect(page.locator('app-info-bar')).toContainText(
    'Data Maturity: BETA',
  );
});
