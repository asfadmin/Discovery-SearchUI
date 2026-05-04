import { test, expect } from '@playwright/test';

test('Baseline Start & End Date Filters in Spanish', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page
    .getByRole('button', { name: /Búsqueda Geográfica/i })
    .first()
    .click();
  await page.getByRole('menuitem', { name: /Línea Base/i }).click();
  await page
    .getByRole('region', { name: 'Escena' })
    .getByLabel('Escena')
    .click();
  await page
    .getByRole('region', { name: 'Escena' })
    .getByLabel('Escena')
    .fill(
      'S1A_IW_SLC__1SDV_20180616T210817_20180616T210845_022387_026C91_EDAA',
    );
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'BUSCAR' })
    .click();
  await page.getByRole('radio', { name: 'Criterios de Línea Base' }).click();
  await page.getByText('Fecha de Inicio').click();
  await page.getByRole('textbox', { name: 'Fecha de Inicio' }).fill('9/1/2018');
  await page.getByText('Fecha Final').click();
  await page.getByRole('textbox', { name: 'Fecha Final' }).fill('1/1/21');
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'BUSCAR' })
    .click();
  await expect(page.locator('app-scenes-list-header')).toContainText('72 de');
});
