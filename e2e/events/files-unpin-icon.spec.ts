import { test, expect } from 'e2e/fixtures';

test('Files: Unpin Icon', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  await page
    .locator('app-sarviews-header')
    .getByRole('combobox', { name: 'Event Search' })
    .fill('Lebu');
  await page.getByRole('option', { name: /Lebu/i }).first().click();
  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.locator('.product-list-header')).toContainText('Files');

  const fileOptions = page.locator('#event-selection-list mat-list-option');
  const firstPinnedFile = fileOptions.first();
  const secondPinnedFile = fileOptions.nth(3);

  await expect(firstPinnedFile).toBeVisible();
  await expect(secondPinnedFile).toBeVisible();

  await firstPinnedFile.click();
  await secondPinnedFile.click();

  const queueAllButton = page
    .locator('app-scenes-list-header')
    .locator('.list-button-group')
    .filter({ hasText: 'Queue' })
    .locator('mat-icon')
    .filter({ hasText: 'add_shopping_cart' });

  await queueAllButton.click();
  await expect(
    page.getByRole('menuitem', { name: /Selected Event Products\s+\(2 Files\)/i }),
  ).toBeVisible();
  await page.keyboard.press('Escape');

  await secondPinnedFile.click();

  await queueAllButton.click();
  await expect(
    page.getByRole('menuitem', { name: /Selected Event Products\s+\(1 Files\)/i }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
});
