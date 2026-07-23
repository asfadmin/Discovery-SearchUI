import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('Displacement: deleting a selected series removes it from the AOI list', async ({
  page,
}) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();

  const displacementResults = page.locator('app-timeseries-results-menu');
  const seriesItems = displacementResults.locator('li.point-list-item');
  const initialSeriesCount = await seriesItems.count();

  await expect(page.getByRole('switch', { name: 'Draw' })).toBeChecked();

  await page.mouse.click(800, 600);

  await expect(seriesItems).toHaveCount(initialSeriesCount + 1);

  const newSeriesItem = seriesItems.last();

  await newSeriesItem.click();
  await expect(newSeriesItem).toHaveClass(/ts-highlighted/);

  await newSeriesItem.getByRole('button').click();

  await expect(seriesItems).toHaveCount(initialSeriesCount);
});
