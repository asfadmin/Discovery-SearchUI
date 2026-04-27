import { test, expect } from '@playwright/test';

test('Zoom to Results', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText(
    /\d+\s+Events?/,
  );

  const eventHeader = page.locator('app-sarviews-header');
  const eventSearch = eventHeader.getByRole('combobox', {
    name: 'Event Search',
  });
  const searchButton = eventHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });
  const queueHeader = page.locator('app-scenes-list-header');
  const zoomActions = queueHeader.locator('.list-button-group').filter({
    hasText: 'Zoom',
  });
  const zoomToResultsButton = zoomActions
    .locator('mat-icon')
    .filter({ hasText: 'settings_overscan' });
  const zoomOutButton = page
    .getByRole('radiogroup')
    .filter({ hasText: 'addremove' })
    .locator('mat-icon')
    .filter({ hasText: 'remove' });

  await eventSearch.fill('Albania');
  await page.getByRole('option', { name: /Albania/i }).first().click();
  await searchButton.click();

  await expect(page.locator('.product-list-header')).toContainText(
    /\d+\s+of\s+\d+\s+Files?/i,
  );
  await expect(zoomToResultsButton).toHaveCount(1);

  await zoomOutButton.click();
  await expect
    .poll(() => new URL(page.url()).hash, { timeout: 10_000 })
    .not.toContain('zoom=7.000');

  const urlBeforeZoom = page.url();

  await zoomToResultsButton.click();

  await expect.poll(() => page.url(), { timeout: 10_000 }).not.toBe(urlBeforeZoom);
  await expect
    .poll(() => new URL(page.url()).hash, { timeout: 10_000 })
    .toContain('zoom=7.000');
});
