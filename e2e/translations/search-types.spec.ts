import { test, expect } from '@playwright/test';

test('Search types display in Spanish translations', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page
    .getByRole('button', { name: /Búsqueda Geográfica/i })
    .first()
    .click();

  await expect(
    page.getByRole('menuitem', { name: /Geográfica/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('menuitem', { name: /Línea Base/i }),
  ).toBeVisible();
  await expect(page.getByRole('menuitem', { name: /SBAS/i })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: /Evento/i })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: /Lista/i })).toBeVisible();
  await expect(
    page.getByRole('menuitem', { name: /Productos On Demand/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('menuitem', { name: /Conjunto de Datos Derivados/i }),
  ).toBeVisible();
});
