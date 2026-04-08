import { test, expect } from '@playwright/test';

test('Auto search triggers when max results changes', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');

  const initialSearchPromise = page.waitForResponse(
    (response) =>
      response.url().includes('output=jsonlite2') &&
      response.url().includes('maxResults=250') &&
      response.status() === 200,
  );
  await page
    .locator('#dataset-button-toggle-group button.search-button')
    .first()
    .click();
  await initialSearchPromise;

  await expect(page.locator('app-scenes-list-header')).toContainText(
    '250 of',
    { ignoreCase: true },
  );
  await expect(page).toHaveScreenshot('max-results-3-initial-250.png');

  const updatedSearchPromise = page.waitForResponse(
    (response) =>
      response.url().includes('output=jsonlite2') &&
      response.url().includes('maxResults=500') &&
      response.status() === 200,
  );
  await page
    .locator('app-max-results-selector .clickable')
    .first()
    .click();
  await page.getByRole('menuitem', { name: '500 Files' }).click();
  await updatedSearchPromise;

  await expect(page.locator('app-scenes-list-header')).toContainText(
    '500 of',
    { ignoreCase: true, timeout: 60000 },
  );
  await expect(page).toHaveScreenshot('max-results-3-updated-500.png');
});
