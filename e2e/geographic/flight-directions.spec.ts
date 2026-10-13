import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('Two Directions available', async ({ page }) => {
  await sentinel1Page(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('combobox', { name: 'Direction' }).click();
  await page.getByText('Descending').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('app-info-bar')).toContainText(
    'Flight Dir: Descending',
  );
});
