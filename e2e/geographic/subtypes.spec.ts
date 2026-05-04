import { test, expect } from '../fixtures';

test('Sentinel Satellite Filter', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.locator('#mat-select-value-3').click();
  await page
    .getByRole('option', { name: 'SC' })
    .locator('mat-pseudo-checkbox')
    .click();
  await expect(page.locator('app-info-bar')).toContainText('Dataset: SC');
});
