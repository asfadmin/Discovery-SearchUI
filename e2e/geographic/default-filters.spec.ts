import { test, expect } from 'e2e/fixtures';

test('NISAR default filter sticks around', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'NISAR (Provisional) NISAR' })
    .click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
  const headerSearchActionsButton = page
    .locator('app-dataset-header')
    .locator('app-search-button')
    .locator('.arrow-button-toggle');
  const filterPanelSearchActionsButton = page
    .locator('.dataset-filters-card .footer')
    .locator('app-search-button')
    .locator('.arrow-button-toggle');
  await headerSearchActionsButton.click();
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Production Configuration' })
    .click();
  await page.getByRole('option', { name: 'Production' }).click();
  await page.getByText('Urgent Response').click();
  await page.locator('.cdk-overlay-backdrop').click();

  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: UR',
  );
  await filterPanelSearchActionsButton.click();
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
});
