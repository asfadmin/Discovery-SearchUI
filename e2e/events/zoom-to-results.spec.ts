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

  // After search: polygon, searchType, eventID and zoom must be set
  await expect
    .poll(() => getHashParams().get('polygon'), { timeout: 10_000 })
    .toContain('POLYGON');
  await expect
    .poll(() => getHashParams().get('searchType'), { timeout: 10_000 })
    .toBe('Event Search');
  await expect
    .poll(() => getHashParams().get('eventID'), { timeout: 10_000 })
    .toBeTruthy();
  await expect
    .poll(() => getZoom(), { timeout: 10_000 })
    .not.toBeNull();

  const polygonAfterSearch = getHashParams().get('polygon');
  const eventIDAfterSearch = getHashParams().get('eventID');
  const zoomAfterSearch = getZoom() as number;

  // Zoom out: zoom level must decrease, search params must NOT change
  await zoomOutButton.click();
  await expect
    .poll(() => getZoom(), { timeout: 10_000 })
    .toBeLessThan(zoomAfterSearch);
  await expect(getHashParams().get('polygon')).toBe(polygonAfterSearch);
  await expect(getHashParams().get('eventID')).toBe(eventIDAfterSearch);
  await expect(getHashParams().get('searchType')).toBe('Event Search');

  const zoomAfterZoomOut = getZoom() as number;

  // Zoom to results: zoom must go back up, search params must remain intact
  await zoomToResultsButton.click();
  await expect
    .poll(() => getZoom(), { timeout: 10_000 })
    .toBeGreaterThan(zoomAfterZoomOut);
  await expect
    .poll(() => getHashParams().get('polygon'), { timeout: 10_000 })
    .toBe(polygonAfterSearch);
  await expect(getHashParams().get('eventID')).toBe(eventIDAfterSearch);
  await expect(getHashParams().get('searchType')).toBe('Event Search');
});
