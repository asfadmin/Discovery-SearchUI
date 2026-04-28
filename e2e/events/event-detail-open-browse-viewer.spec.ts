import { test, expect } from '@playwright/test';

test('Event Detail: Open Browse Viewer', async ({ page }) => {
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

  await eventSearch.fill('Salcha');
  await page.getByRole('option', { name: '7 km SSE of Salcha, Alaska' }).click();
  await searchButton.click();

  await expect(page.locator('.product-list-header')).toContainText(
    /\d+\s+of\s+\d+\s+Files?/i,
  );
  await expect(browseImage).toBeVisible();
  await expect(browseDialog).toHaveCount(0);

  await browseImage.click();

  await expect(browseDialog).toBeVisible();
  await expect(browseDialog.getByText('Event Detail')).toBeVisible();
  await expect(browseDialog.getByText('Scene Detail')).toBeVisible();
  await expect(browseDialog.getByText('Product Details')).toBeVisible();
});
