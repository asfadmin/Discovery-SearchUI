import { test, expect } from '@playwright/test';

test('Flight directions filter displays in Spanish', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page.getByRole('button', { name: 'Filtros', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Dirección$/ })
    .first()
    .click();
  await page.getByText('Descendente').click();
  await page.locator('.cdk-overlay-backdrop').click();

  await expect(page.locator('app-info-bar')).toContainText(
    'Dirección de vuelo:',
  );
});
