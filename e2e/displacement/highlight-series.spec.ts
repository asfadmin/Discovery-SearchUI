import { test, expect } from 'e2e/fixtures';

test('Displacement: selecting a series highlights it in the AOI list', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();

  const displacementResults = page.locator('app-timeseries-results-menu');
  const initialSeriesCount = await displacementResults
    .locator('li.point-list-item')
    .count();

  await expect(page.getByRole('switch', { name: 'Draw' })).toBeChecked();

  await page.mouse.click(800, 600);

  await expect(displacementResults.locator('li.point-list-item')).toHaveCount(
    initialSeriesCount + 1,
  );

  const newSeriesItem = displacementResults
    .locator('li.point-list-item')
    .last();

  await newSeriesItem.click();

  await expect(newSeriesItem).toHaveClass(/ts-highlighted/);
});
