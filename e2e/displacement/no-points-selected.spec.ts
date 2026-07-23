import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('Displacement: shows the empty state when no points are selected', async ({
  page,
}) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();

  await expect(
    page.getByRole('tooltip', { name: 'Click point' }),
  ).toBeVisible();
  await expect(
    page.locator('app-timeseries-results-menu').locator('li.point-list-item'),
  ).toHaveCount(0);
});
