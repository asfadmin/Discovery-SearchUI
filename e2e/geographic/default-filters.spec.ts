import { test, expect } from 'e2e/fixtures';

test('NISAR default filter sticks around', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'NISAR (Uncalibrated) NISAR' })
    .click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
  await page.locator('#mat-button-toggle-9-button').click();
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Production ConfigurationProduction$/ })
    .first()
    .click();
  await page.getByRole('option', { name: 'Production' }).click();
  await page.getByText('Urgent Response').click();
  await page.locator('.cdk-overlay-backdrop').click();

  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: UR',
  );
  await page.locator('#mat-button-toggle-7-button').click();
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Production Configuration: PR',
  );
});
