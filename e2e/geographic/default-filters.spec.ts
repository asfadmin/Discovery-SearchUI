import { test, expect } from 'e2e/fixtures';

test.use({ viewport: { width: 1600, height: 1200 } });

test('NISAR default filter sticks around', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'NISAR (Uncalibrated) NISAR' })
    .click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
  const searchActionsButton = page
    .locator('app-dataset-header')
    .locator('app-search-button')
    .locator('.arrow-button-toggle');
  await searchActionsButton.dispatchEvent('click');
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('combobox', { name: 'Production Configuration' }).click();
  await page.getByRole('option', { name: 'Production' }).click();
  await page.getByText('Urgent Response').click();
  await page.locator('.cdk-overlay-backdrop').click();

  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: UR',
  );
  await searchActionsButton.dispatchEvent('click');
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
});
