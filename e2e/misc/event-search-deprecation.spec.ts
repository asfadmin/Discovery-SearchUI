import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('test', async ({ page }) => {
  await sentinel1Page(page);

  await page.goto('/#/?searchType=Event%20Search');
  await page.waitForLoadState('networkidle');

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
