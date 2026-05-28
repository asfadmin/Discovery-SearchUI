import { test, expect } from 'e2e/fixtures';

test('Browse Viewer: Download or Add to Download Queue', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  await page
    .locator('app-sarviews-header')
    .getByRole('combobox', { name: 'Event Search' })
    .fill('Dali');
  await page.getByRole('option', { name: /Dali/i }).first().click();
  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.locator('.product-list-header')).toContainText('Files');

  const browseImage = page.locator('app-scene-detail .browse-img').last();
  await browseImage.click();

  await expect(page.locator('.browse-dialog')).toBeVisible();

  await page.locator('.browse-dialog .file-button-download').first().click();
  await page.getByRole('menuitem').filter({ hasText: 'add_shopping_cart' }).click();

  await page.locator('.browse-dialog .close-icon button').click();
  await expect(page.locator('.browse-dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText('1 Files');
  await expect(page.locator('.dl-mat-dialog-content mat-list-item')).toHaveCount(
    1,
  );
  await expect(page.locator('.on-demand-warning')).toContainText(
    'Event Monitoring products in queue - limited export options',
  );
});
