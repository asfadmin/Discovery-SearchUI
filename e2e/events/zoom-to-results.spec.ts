import { test, expect } from 'e2e/fixtures';

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

  await page
    .locator('app-sarviews-header')
    .getByRole('combobox', { name: 'Event Search' })
    .fill('Albania');
  await page
    .getByRole('option', { name: /Albania/i })
    .first()
    .click();
  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.locator('.product-list-header')).toContainText('Files');

  const zoomToResultsButton = page
    .locator('app-scenes-list-header')
    .locator('.list-button-group')
    .filter({ hasText: 'Zoom' })
    .locator('mat-button-toggle.control-mat-button-toggle');
  await expect(zoomToResultsButton).toHaveCount(1);
  const urlBeforeZoom = page.url();

  await zoomToResultsButton.evaluate((element: HTMLElement) => element.click());

  await expect.poll(() => page.url()).not.toBe(urlBeforeZoom);
});
