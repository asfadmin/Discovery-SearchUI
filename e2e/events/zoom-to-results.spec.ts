import { test, expect } from '@playwright/test';

test('Zoom to Results', async ({ page, browserName }) => {
  test.skip(
    browserName === 'firefox',
    'Firefox CI shows browser-specific map behavior for this flow.',
  );

  const getHashParams = () => {
    const [, hash = ''] = page.url().split('#/');
    return new URLSearchParams(hash.startsWith('?') ? hash.slice(1) : hash);
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
  const zoomToResultsButton = zoomActions.locator(
    'mat-button-toggle.control-mat-button-toggle',
  );

  await eventSearch.fill('Albania');
  await page.getByRole('option', { name: /Albania/i }).first().click();
  await searchButton.click();

  await expect(page.locator('.product-list-header')).toContainText(
    /\d+\s+of\s+\d+\s+Files?/i,
  );
  await expect(zoomToResultsButton).toHaveCount(1);

  // After search: searchType and eventID must be set
  await expect
    .poll(() => getHashParams().get('searchType'), { timeout: 10_000 })
    .toBe('Event Search');
  await expect
    .poll(() => getHashParams().get('eventID'), { timeout: 10_000 })
    .toBeTruthy();

  const eventIDAfterSearch = getHashParams().get('eventID');
  const urlAfterSearch = page.url();

  // Zoom to results may rewrite viewport params differently across browsers,
  // but it should still change the URL while preserving the selected event.
  await zoomToResultsButton.evaluate((element: HTMLElement) => element.click());

  await expect
    .poll(() => page.url(), { timeout: 10_000 })
    .not.toBe(urlAfterSearch);
  await expect
    .poll(() => getHashParams().get('polygon'), { timeout: 10_000 })
    .toContain('POLYGON');
  await expect(getHashParams().get('eventID')).toBe(eventIDAfterSearch);
  await expect(getHashParams().get('searchType')).toBe('Event Search');
});
