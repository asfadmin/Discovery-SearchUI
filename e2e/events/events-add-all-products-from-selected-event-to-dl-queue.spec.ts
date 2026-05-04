import { test, expect } from 'e2e/fixtures';

test('Events: Add all Products from Selected Event to DL Queue', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  await page
    .locator('app-sarviews-header')
    .getByRole('combobox', { name: 'Event Search' })
    .fill('Albania');
  await page.getByRole('option', { name: /Albania/i }).first().click();
  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  const productListHeader = page.locator('.product-list-header');
  await expect(productListHeader).toContainText('Files');

  const headerText = (await productListHeader.textContent()) ?? '';
  const match = headerText.match(/(\d+)\s+of\s+(\d+)\s+Files?/i);

  expect(match).toBeTruthy();

  const filteredCount = Number(match?.[1] ?? 0);
  const totalCount = Number(match?.[2] ?? 0);

  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBe(totalCount);

  const queueAllButton = page
    .locator('app-scenes-list-header')
    .locator('.list-button-group')
    .filter({ hasText: 'Queue' })
    .locator('mat-icon')
    .filter({ hasText: 'add_shopping_cart' });
  await expect(queueAllButton).toHaveCount(1);

  await queueAllButton.click();
  await page.getByRole('menuitem', { name: /All Event Products/i }).click();

  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText(`${totalCount} Files`);
  await expect(page.locator('.dl-mat-dialog-content mat-list-item')).toHaveCount(
    totalCount,
  );
  await expect(page.locator('.on-demand-warning')).toContainText(
    'Event Monitoring products in queue - limited export options',
  );
});
