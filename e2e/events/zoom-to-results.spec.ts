import { test, expect } from '@playwright/test';

test('Zoom to Results', async ({ page }) => {
  const getHash = () => new URL(page.url()).hash;

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
  const zoomToResultsControl = zoomActions.locator(
    'mat-button-toggle.control-mat-button-toggle',
  );

  await eventSearch.fill('Albania');
  await page.getByRole('option', { name: /Albania/i }).first().click();
  await searchButton.click();

  await expect(page.locator('.product-list-header')).toContainText(
    /\d+\s+of\s+\d+\s+Files?/i,
  );
  await expect(zoomToResultsControl).toHaveCount(1);

  const hashBeforeZoom = getHash();
  expect(hashBeforeZoom).not.toContain('center=');

  await zoomToResultsControl.evaluate((element: HTMLElement) => element.click());

  await expect
    .poll(getHash, { timeout: 10_000 })
    .toContain('center=');
  await expect.poll(getHash, { timeout: 10_000 }).not.toBe(hashBeforeZoom);
});
