import { test, expect } from '@playwright/test';

test('Events: Add all Products from Selected Event to DL Queue', async ({
  page,
}) => {
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
  const productListHeader = page.locator('.product-list-header');
  const queueHeader = page.locator('app-scenes-list-header');
  const queueActions = queueHeader.locator('.list-button-group').filter({
    hasText: 'Queue',
  });
  const queueAllButton = queueActions
    .locator('mat-icon')
    .filter({ hasText: 'add_shopping_cart' });

  await eventSearch.fill('Albania');
  await page.getByRole('option', { name: /Albania/i }).first().click();
  await searchButton.click();

  await expect(productListHeader).toContainText(/\d+\s+of\s+\d+\s+Files?/i);

  const headerText = (await productListHeader.textContent()) ?? '';
  const match = headerText.match(/(\d+)\s+of\s+(\d+)\s+Files?/i);

  expect(match).toBeTruthy();

  const filteredCount = Number(match?.[1] ?? 0);
  const totalCount = Number(match?.[2] ?? 0);

  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBe(totalCount);
  await expect(queueAllButton).toHaveCount(1);

  await queueAllButton.click();

  const addAllMenuItem = page.getByRole('menuitem', {
    name: new RegExp(`All\\s+Event\\s+Products\\s*\\(${totalCount}\\s+Files\\)`, 'i'),
  });

  await expect(addAllMenuItem).toBeVisible();
  await addAllMenuItem.click();

  await page.getByRole('button', { name: 'Downloads' }).click();

  await expect(page.locator('.dl-subtitle')).toContainText(`${totalCount} Files`);
  await expect(page.locator('.dl-mat-dialog-content mat-list-item')).toHaveCount(
    totalCount,
  );
  await expect(page.locator('.on-demand-warning')).toContainText(
    'Event Monitoring products in queue - limited export options',
  );
});
