import { test, expect } from '@e2e/fixtures';

test('No direction selections available', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'AIRSAR AIRSAR was an all-' })
    .click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.locator('#mat-mdc-hint-28')).toContainText(
    'No flight directions to select',
  );
});
test('Two Directions available', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Direction$/ })
    .first()
    .click();
  await page.getByText('Descending').click();
  await page.locator('.cdk-overlay-backdrop').click();
  await expect(page.locator('app-info-bar')).toContainText(
    'Flight Dir: Descending',
  );
});
