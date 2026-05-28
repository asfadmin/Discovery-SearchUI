import { test, expect } from 'e2e/fixtures';

test('Sentinel Satellite Filter', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const subtypeFilter = page.getByRole('combobox', { name: 'Subtype' });
  await subtypeFilter.click();
  await page.getByRole('option', { name: 'SC' }).click();
  await expect(page.locator('app-info-bar')).toContainText('Dataset: SC');
});
