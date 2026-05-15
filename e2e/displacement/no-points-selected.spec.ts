import { test, expect } from 'e2e/fixtures';

test('Displacement: shows the empty state when no points are selected', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();

  await expect(page.getByRole('tooltip', { name: 'Click point' })).toBeVisible();
  await expect(
    page.locator('app-timeseries-results-menu').locator('li.point-list-item'),
  ).toHaveCount(0);
});
