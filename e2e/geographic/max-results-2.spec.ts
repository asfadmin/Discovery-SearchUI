import { test, expect } from '@playwright/test';
import { waitForASFAPIResponse } from '../helpers';

test('Auto search triggers when max results changes', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');

  const searchResponsePromise = waitForASFAPIResponse(page);
  await page
    .locator('#dataset-button-toggle-group button.search-button')
    .first()
    .click();
  await searchResponsePromise;

  await expect(page.locator('app-scenes-list-header')).toContainText(
    '250 of',
    { ignoreCase: true },
  );
  await expect(page).toHaveScreenshot('max-results-2-initial-250.png');

  await page
    .locator('app-max-results-selector .clickable')
    .first()
    .click();
  await page.getByRole('menuitem', { name: '500 Files' }).click();

  const secondSearchResponse = await page.waitForResponse(
    (response) =>
      response.url().includes('output=jsonlite2') &&
      response.url().includes('maxResults=500') &&
      response.status() === 200,
  );

  const requestUrl = secondSearchResponse.url();
  expect(requestUrl).toContain('maxResults=500');

  await expect(page.locator('app-scenes-list-header')).toContainText(
    '500 of',
    { ignoreCase: true, timeout: 60000 },
  );
  await expect(page).toHaveScreenshot('max-results-2-updated-500.png');
});
