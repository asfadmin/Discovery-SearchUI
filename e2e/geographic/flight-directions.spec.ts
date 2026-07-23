import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('No direction selections available', async ({ page }) => {
  await standardizedPage(page);
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'AIRSAR AIRSAR was an all-' })
    .click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.getByText('No flight directions to select')).toBeVisible();
});
test('Two Directions available', async ({ page }) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('combobox', { name: 'Direction' }).click();
  await page.getByText('Descending').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('app-info-bar')).toContainText(
    'Flight Dir: Descending',
  );
});
