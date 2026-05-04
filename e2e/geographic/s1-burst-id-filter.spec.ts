import { test, expect } from '../fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('S1 Burst ID filter returns matching results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page.getByRole('menuitem', { name: 'S1 Burst' }).click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByLabel('Full Burst ID').fill('088_187244_IW3');

  const responsePromise = waitForASFAPIResponse(page);
  await page
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await expect(page.locator('app-info-bar')).toContainText(
    'Full Burst ID: 088_187244_IW3',
  );
  await expect(page.locator('mat-card-header').first()).toBeVisible();
});
