import { test, expect } from '@playwright/test';

test('Product Criteria: Path & Frame', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  const getFileCounts = async () => {
    const headerText =
      (await page.locator('.product-list-header').textContent()) ?? '';
    const match = headerText.match(/(\d+)\s+of\s+(\d+)\s+Files?/i);

    expect(match).toBeTruthy();

    return {
      filtered: Number(match?.[1] ?? 0),
      total: Number(match?.[2] ?? 0),
    };
  };

  const eventHeader = page.locator('app-sarviews-header');
  const eventSearch = eventHeader.getByRole('combobox', {
    name: 'Event Search',
  });
  const searchButton = eventHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });
  const productFilters = page.getByRole('region', { name: 'Product Filters' });
  const pathStart = productFilters.getByPlaceholder('Path Start');
  const pathEnd = productFilters.getByPlaceholder('Path End');
  const productListHeader = page.locator('.product-list-header');

  await eventSearch.fill('Salcha');
  await page.getByRole('option', { name: '7 km SSE of Salcha, Alaska' }).click();
  await searchButton.click();

  await expect(productListHeader).toContainText('Files');

  const fileCountsBefore = await getFileCounts();
  const productListTextBefore = (await productListHeader.textContent()) ?? '';

  expect(fileCountsBefore.filtered).toBeGreaterThan(0);
  expect(fileCountsBefore.filtered).toBe(fileCountsBefore.total);

  await pathStart.fill('90');
  await pathEnd.fill('95');
  await searchButton.click();

  await expect(pathStart).toHaveValue('90');
  await expect(pathEnd).toHaveValue('95');
  await expect(productListHeader).not.toHaveText(productListTextBefore, {
    timeout: 10_000,
  });

  const fileCountsAfter = await getFileCounts();

  expect(fileCountsAfter.total).toBe(fileCountsBefore.total);
  expect(fileCountsAfter.filtered).toBeLessThan(fileCountsAfter.total);
});
