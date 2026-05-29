import { test, expect } from 'e2e/fixtures';

test('File Type Select Multiple', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const productTypeSelector = page.locator('app-product-type-selector');
  await productTypeSelector.getByRole('combobox', { name: 'File Type' }).click();
  await page
    .getByRole('option', { name: 'L1 Single Look Complex (SLC)' })
    .click();
  await page
    .getByRole('option', { name: 'L1 Detected High-Res Dual-Pol (GRD-HD)' })
    .click();
  await page.keyboard.press('Escape');
  await expect(page.locator('app-info-bar')).toContainText(
    'File Types: GRD_HD,SLC',
  );
});
