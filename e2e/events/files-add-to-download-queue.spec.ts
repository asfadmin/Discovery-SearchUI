import { test, expect } from '@playwright/test';

test('Files: Add to download queue', async ({ page }) => {
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
  const firstFile = page.locator('#event-selection-list mat-list-option').first();
  const addToDownloadsIcon = firstFile
    .locator('mat-icon')
    .filter({ hasText: 'add_shopping_cart' })
    .first();

  await eventSearch.fill('Acapulco');
  await page.getByRole('option', { name: /Acapulco/i }).first().click();
  await searchButton.click();

  await expect(page.locator('.product-list-header')).toContainText(
    /\d+\s+of\s+\d+\s+Files?/i,
  );
  await expect(firstFile).toBeVisible();
  await firstFile.scrollIntoViewIfNeeded();
  await expect(addToDownloadsIcon).toHaveCount(1);

  await addToDownloadsIcon.click();

  await expect(firstFile.locator('mat-icon').filter({ hasText: 'shopping_cart' }))
    .toHaveCount(1);

  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText('1 Files');
  await expect(page.locator('.dl-mat-dialog-content mat-list-item')).toHaveCount(
    1,
  );
  await expect(page.locator('.on-demand-warning')).toContainText(
    'Event Monitoring products in queue - limited export options',
  );
});
