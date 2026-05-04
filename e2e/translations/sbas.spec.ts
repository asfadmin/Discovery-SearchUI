import { test, expect } from '@playwright/test';

test('SBAS Start & End Date Filters in Spanish', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page
    .getByRole('button', { name: /Búsqueda Geográfica/i })
    .first()
    .click();
  await page.getByRole('menuitem', { name: /SBAS/i }).click();
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

  const sbasFiltersButton = page
    .locator('mat-button-toggle')
    .filter({ hasText: 'Filtros SBAS' });
  await expect(sbasFiltersButton).toBeVisible({ timeout: 20_000 });
  await sbasFiltersButton.click();

  await page.getByRole('textbox', { name: 'Fecha de Inicio' }).fill('9/1/2018');
  await page
    .getByRole('textbox', { name: 'Fecha Final' })
    .fill('11/1/2020');
  await page.keyboard.press('Tab');

  await expect(page.locator('app-scenes-list-header')).toContainText('67 Pares');
});
