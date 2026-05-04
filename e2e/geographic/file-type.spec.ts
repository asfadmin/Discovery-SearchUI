import { test, expect } from '@e2e/fixtures';

test('File Type Select Multiple', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^File Type$/ })
    .first()
    .click();
  await page.getByText('(SLC)').first().click();
  await page.getByText('(GRD-HD)').first().click();
  await page.locator('.cdk-overlay-backdrop').click();
  await expect(page.locator('app-info-bar')).toContainText(
    'File Types: GRD_HD,SLC',
  );
});
