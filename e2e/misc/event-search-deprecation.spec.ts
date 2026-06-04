import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/#/?searchType=Event%20Search');
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
