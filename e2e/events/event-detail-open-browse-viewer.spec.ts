import { test, expect } from '../fixtures';

test('Event Detail: Open Browse Viewer', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  await page
    .locator('app-sarviews-header')
    .getByRole('combobox', { name: 'Event Search' })
    .fill('Salcha');
  await page.getByRole('option', { name: '7 km SSE of Salcha, Alaska' }).click();
  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.locator('.product-list-header')).toContainText('Files');

  const browseImage = page.locator('app-scene-detail .browse-img').last();
  const browseDialog = page.locator('.browse-dialog');

  await expect(browseImage).toBeVisible();
  await expect(browseDialog).toHaveCount(0);

  await browseImage.click();

  await expect(browseDialog).toBeVisible();
  await expect(browseDialog.getByText('Event Detail')).toBeVisible();
  await expect(browseDialog.getByText('Scene Detail')).toBeVisible();
  await expect(browseDialog.getByText('Product Details')).toBeVisible();
});
