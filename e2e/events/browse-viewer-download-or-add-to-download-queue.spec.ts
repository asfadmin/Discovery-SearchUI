import { test, expect } from '@playwright/test';

test('Browse Viewer: Download or Add to Download Queue', async ({ page }) => {
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
  const sceneDetail = page.locator('app-scene-detail');
  const browseImage = sceneDetail.locator('.browse-img').last();
  const browseDialog = page.locator('.browse-dialog');
  const closeBrowseDialogButton = browseDialog.locator('.close-icon button');

  await eventSearch.fill('Dali');
  await page.getByRole('option', { name: /Dali/i }).first().click();
  await searchButton.click();

  await expect(page.locator('.product-list-header')).toContainText(
    /\d+\s+of\s+\d+\s+Files?/i,
  );
  await expect(browseImage).toBeVisible();

  await browseImage.click();

  await expect(browseDialog).toBeVisible();

  const fileActionButton = browseDialog.locator('.file-button-download').first();

  await fileActionButton.click();
  const addToDownloads = page.getByRole('menuitem').filter({
    hasText: 'add_shopping_cart',
  });
  await expect(addToDownloads).toContainText('Add');
  await addToDownloads.click();

  await closeBrowseDialogButton.click();
  await expect(browseDialog).toHaveCount(0);

  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText('1 Files');
  await expect(page.locator('.dl-mat-dialog-content mat-list-item')).toHaveCount(
    1,
  );
  await expect(page.locator('.on-demand-warning')).toContainText(
    'Event Monitoring products in queue - limited export options',
  );
});
