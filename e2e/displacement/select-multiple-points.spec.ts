import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('Displacement: adding multiple points creates multiple series', async ({
  page,
}) => {
  await sentinel1Page(page);

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

  await page.mouse.click(650, 400);

  await expect(seriesItems).toHaveCount(initialSeriesCount + 2);
  await expect(displacementResults).toContainText(/Series 1\b/);
  await expect(displacementResults).toContainText(/Series 2\b/);
});
