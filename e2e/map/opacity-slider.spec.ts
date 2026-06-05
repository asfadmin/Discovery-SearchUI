import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Map: opacity slider changes browse image opacity', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill('POINT(-146.645508 64.806881)');

  const searchResponse = waitForASFAPIResponse(page);
  await page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await searchResponse;

  await page.locator('app-scene').first().click();

  await page
    .locator('app-map-controls')
    .getByRole('button', { name: 'Browse Image Opacity' })
    .click();

  const slider = page
    .locator('.opacity-slider-mat-menu mat-slider')
    .first()
    .locator('input[type="range"]');

  const initialValue = await slider.inputValue();
  await slider.focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');

  await expect.poll(() => slider.inputValue()).not.toBe(initialValue);
  await expect(page).toHaveScreenshot();
});
