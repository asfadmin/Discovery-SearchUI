import { test, expect } from '@playwright/test';

test('Product Criteria: Product Type', async ({ page }) => {
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
  const productType = productFilters.getByRole('combobox', {
    name: 'Product Type',
  });
  const productListHeader = page.locator('.product-list-header');

  await eventSearch.fill('Falam');
  await page.getByRole('option', { name: /Falam/i }).first().click();
  await searchButton.click();

  await expect(productListHeader).toContainText('Files');

  const fileCountsBefore = await getFileCounts();
  const productListTextBefore = (await productListHeader.textContent()) ?? '';

  expect(fileCountsBefore.filtered).toBeGreaterThan(0);
  expect(fileCountsBefore.filtered).toBe(fileCountsBefore.total);

  await productType.focus();
  await page.keyboard.press('Space');
  const rtcGammaOption = page.getByRole('option', { name: 'RTC_GAMMA' });
  await rtcGammaOption.press('Enter');
  await page.keyboard.press('Escape');
  await searchButton.click();

  await expect(page.getByText('Product Types: RTC_GAMMA')).toBeVisible();
  await expect(productListHeader).not.toHaveText(productListTextBefore, {
    timeout: 10_000,
  });

  const fileCountsAfter = await getFileCounts();

  expect(fileCountsAfter.total).toBe(fileCountsBefore.total);
  expect(fileCountsAfter.filtered).toBeLessThan(fileCountsAfter.total);
});
