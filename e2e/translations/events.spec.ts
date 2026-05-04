import { test, expect } from '@playwright/test';

test('Active/Inactive Event Filter in Spanish', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page
    .getByRole('button', { name: /Búsqueda Geográfica/i })
    .first()
    .click();
  await page
    .getByRole('menuitem', { name: /Evento La búsqueda de eventos/i })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Eventos');

  const inactiveEventIcons = page.locator(
    'app-sarviews-event img[src*="_inactive"]',
  );
  await expect(inactiveEventIcons.first()).toBeVisible({ timeout: 10_000 });

  const activeEventsToggle = page
    .getByRole('region', { name: 'Filtros de Eventos' })
    .getByRole('switch', { name: 'Solo Eventos Activos' });
  await activeEventsToggle.focus();
  await page.keyboard.press('Space');
  await expect(activeEventsToggle).toBeChecked();

  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'BUSCAR' })
    .click();

  await expect(inactiveEventIcons).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator('app-scenes-list-header')).toContainText('Eventos');
});
