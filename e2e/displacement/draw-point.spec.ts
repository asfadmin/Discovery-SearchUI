import { test, expect } from 'e2e/fixtures';

test('Displacement: drawing a point adds a series to the AOI list', async ({
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

  const drawToggle = page.getByRole('switch', { name: 'Draw' });
  await expect(drawToggle).toBeChecked();

  await page.mouse.click(800, 600);

  await expect(displacementResults.locator('li.point-list-item')).toHaveCount(
    initialSeriesCount + 1,
  );
  await expect(displacementResults).toContainText(/Series\s+\d+/);
});
