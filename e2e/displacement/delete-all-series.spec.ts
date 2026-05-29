import { test, expect } from 'e2e/fixtures';

test('Displacement: deleting all series clears the AOI list', async ({
  page,
}) => {
  await page.goto('/');

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

  const deleteAllSection = displacementResults.locator(
    'span.parent-checkbox-section',
  );

  await deleteAllSection.hover();
  await displacementResults.locator('button.delete-all-btn2').click();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(seriesItems).toHaveCount(0);
});
