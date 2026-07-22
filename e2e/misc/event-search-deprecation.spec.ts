import { test, expect } from 'e2e/fixtures';

test('test', async ({ page }) => {
  await page.goto('/#/?dataset=SENTINEL-1&searchType=Event%20Search');
  await expect(page.locator('#deprecation-dialog-title')).toContainText(
    'Event Search Deprecation',
  );
  await page
    .getByRole('dialog', { name: 'Event Search Deprecation' })
    .getByRole('button')
    .click();
  await expect(page.locator('app-search-type-selector')).toContainText(
    'Geographic Search',
  );
});
