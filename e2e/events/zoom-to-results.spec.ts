import { test, expect } from '@playwright/test';

test('Zoom to Results', async ({ page }) => {
  const getHashParams = () => {
    const [, hash = ''] = page.url().split('#/');
    return new URLSearchParams(hash.startsWith('?') ? hash.slice(1) : hash);
  };
  const getZoom = () => {
    const z = getHashParams().get('zoom');
    return z ? parseFloat(z) : null;
  };

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

  // After search: polygon, searchType and eventID must be set
  // (zoom may or may not be in URL depending on browser/CI timing)
  await expect
    .poll(() => getHashParams().get('polygon'), { timeout: 10_000 })
    .toContain('POLYGON');
  await expect
    .poll(() => getHashParams().get('searchType'), { timeout: 10_000 })
    .toBe('Event Search');
  await expect
    .poll(() => getHashParams().get('eventID'), { timeout: 10_000 })
    .toBeTruthy();

  const polygonAfterSearch = getHashParams().get('polygon');
  const eventIDAfterSearch = getHashParams().get('eventID');
  const urlAfterSearch = page.url();

  // Zoom out: URL must change, search params must NOT change
  await zoomOutButton.click();
  await expect
    .poll(() => page.url(), { timeout: 10_000 })
    .not.toBe(urlAfterSearch);
  await expect(getHashParams().get('polygon')).toBe(polygonAfterSearch);
  await expect(getHashParams().get('eventID')).toBe(eventIDAfterSearch);
  await expect(getHashParams().get('searchType')).toBe('Event Search');

  const urlAfterZoomOut = page.url();

  // Zoom to results: URL must change again, search params still intact,
  // and zoom level must be written to URL (this is the consistent
  // behavior across browsers — zoom-to-results explicitly sets zoom)
  await zoomToResultsButton.click();
  await expect
    .poll(() => page.url(), { timeout: 10_000 })
    .not.toBe(urlAfterZoomOut);
  await expect
    .poll(() => getZoom(), { timeout: 10_000 })
    .not.toBeNull();
  await expect
    .poll(() => getHashParams().get('polygon'), { timeout: 10_000 })
    .toBe(polygonAfterSearch);
  await expect(getHashParams().get('eventID')).toBe(eventIDAfterSearch);
  await expect(getHashParams().get('searchType')).toBe('Event Search');
});
