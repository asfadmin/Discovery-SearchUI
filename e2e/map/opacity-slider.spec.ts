import { test, expect } from 'e2e/pages/search.page';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Map: opacity slider changes browse image opacity', async ({
  capturedSearchPage,
}) => {
  await capturedSearchPage.goto('/');

  await capturedSearchPage
    .getByRole('button', { name: 'Filters', exact: true })
    .click();
  await capturedSearchPage
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill('POINT(-146.645508 64.806881)');

  const searchResponse = waitForASFAPIResponse(capturedSearchPage);
  await capturedSearchPage
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await searchResponse;

  await capturedSearchPage.locator('app-scene').first().click();

  await capturedSearchPage
    .locator('app-map-controls')
    .getByRole('button', { name: 'Browse Image Opacity' })
    .click();

  const slider = capturedSearchPage
    .locator('.opacity-slider-mat-menu mat-slider')
    .first()
    .locator('input[type="range"]');

  const initialValue = await slider.inputValue();
  await slider.focus();
  await capturedSearchPage.keyboard.press('ArrowLeft');
  await capturedSearchPage.keyboard.press('ArrowLeft');
  await capturedSearchPage.keyboard.press('ArrowLeft');

  await expect.poll(() => slider.inputValue()).not.toBe(initialValue);
  await expect(capturedSearchPage).toHaveScreenshot();
});
