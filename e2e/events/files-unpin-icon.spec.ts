import { test, expect } from '@playwright/test';

test('Files: Unpin Icon', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText(
    /\d+\s+Events?/,
  );

  const getHashParams = () => {
    const [, hash = ''] = page.url().split('#/');
    return new URLSearchParams(hash.startsWith('?') ? hash.slice(1) : hash);
  };

  const eventHeader = page.locator('app-sarviews-header');
  const eventSearch = eventHeader.getByRole('combobox', {
    name: 'Event Search',
  });
  const searchButton = eventHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });
  const productListHeader = page.locator('.product-list-header');
  const fileOptions = page.locator('#event-selection-list mat-list-option');
  const firstPinnedFile = fileOptions.first();
  const secondPinnedFile = fileOptions.nth(3);
  const queueHeader = page.locator('app-scenes-list-header');
  const queueActions = queueHeader.locator('.list-button-group').filter({
    hasText: 'Queue',
  });
  const queueAllButton = queueActions
    .locator('mat-icon')
    .filter({ hasText: 'add_shopping_cart' });

  await eventSearch.fill('Lebu');
  await page.getByRole('option', { name: /Lebu/i }).first().click();
  await searchButton.click();

  await expect(productListHeader).toContainText(/\d+\s+of\s+\d+\s+Files?/i);
  await expect(firstPinnedFile).toBeVisible();
  await expect(secondPinnedFile).toBeVisible();
  await expect.poll(() => getHashParams().get('pinnedProducts')).toBe(null);
  await expect(firstPinnedFile).toHaveAttribute('aria-selected', 'false');
  await expect(secondPinnedFile).toHaveAttribute('aria-selected', 'false');

  await firstPinnedFile.click();
  await secondPinnedFile.click();

  await expect
    .poll(() => getHashParams().get('pinnedProducts')?.split(',').length ?? 0, {
      timeout: 10_000,
    })
    .toBe(2);

  await queueAllButton.click();
  await expect(
    page.getByRole('menuitem', { name: /Selected Event Products\s+\(2 Files\)/i }),
  ).toBeVisible();
  await page.keyboard.press('Escape');

  await secondPinnedFile.click();

  await expect
    .poll(() => getHashParams().get('pinnedProducts')?.split(',').length ?? 0, {
      timeout: 10_000,
    })
    .toBe(1);

  await queueAllButton.click();
  await expect(
    page.getByRole('menuitem', { name: /Selected Event Products\s+\(1 Files\)/i }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
});
