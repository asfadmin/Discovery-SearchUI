import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';
test('Auto Search when max results changes', async ({ page }) => {
  await page.goto('/');
  await page
    .locator('#mat-button-toggle-8-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await waitForASFAPIResponse(page);
  await page
    .locator('app-dataset-header')
    .getByText('250arrow_drop_down')
    .click();

  await page.getByRole('menuitem', { name: '500 Files' }).click();
  await waitForASFAPIResponse(page);

  await expect(page.locator('app-scenes-list-header')).toContainText('500 of');
});
