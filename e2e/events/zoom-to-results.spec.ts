import { test, expect } from '@playwright/test';

test('Zoom to Results', async ({ page, browserName }) => {
  test.skip(
    browserName === 'firefox',
    'Firefox CI shows browser-specific map behavior for this flow.',
  );

  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

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

  await expect(page.locator('.product-list-header')).toContainText('Files');
  await expect(zoomToResultsButton).toHaveCount(1);
  const urlBeforeZoom = page.url();

  await zoomToResultsButton.evaluate((element: HTMLElement) => element.click());

  await expect.poll(() => page.url(), { timeout: 10_000 }).not.toBe(urlBeforeZoom);
});
