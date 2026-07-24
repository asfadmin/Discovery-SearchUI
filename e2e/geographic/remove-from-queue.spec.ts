import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('Geographic: remove scene files from download queue', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill('POINT(-146.645508 64.806881)');

  const searchResponse = waitForASFAPIResponse(page);
  const searchButton = page
    .locator('app-filters-dropdown')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });
  await searchButton.click();
  await searchResponse;

  const firstScene = page.locator('app-scene').first();
  const addToDownloadsIcon = firstScene
    .locator('mat-icon')
    .filter({ hasText: /^\s*add_shopping_cart\s*$/ })
    .first();

  await expect(firstScene).toBeVisible();
  await expect(addToDownloadsIcon).toHaveCount(1);

  await addToDownloadsIcon.click();

  await expect(
    firstScene.locator('mat-icon').filter({ hasText: /^\s*shopping_cart\s*$/ }),
  ).toHaveCount(1);

  await page.getByRole('button', { name: 'Downloads' }).click();
  await expect(page.locator('.dl-subtitle')).toContainText(/\d+\s+Files?/i);
  await expect(
    page.locator('.dl-mat-dialog-content mat-list-item'),
  ).not.toHaveCount(0);

  await page.locator('.dl-close-x').click();

  const removeFromDownloadsIcon = firstScene
    .locator('mat-icon')
    .filter({ hasText: /^\s*shopping_cart\s*$/ })
    .first();

  await removeFromDownloadsIcon.click();
  await expect(
    firstScene
      .locator('mat-icon')
      .filter({ hasText: /^\s*add_shopping_cart\s*$/ }),
  ).toHaveCount(1);

  await page.getByRole('button', { name: 'Downloads' }).click();
  await expect(page.locator('.dl-empty-message')).toContainText(
    /your download queue is empty/i,
  );
});
