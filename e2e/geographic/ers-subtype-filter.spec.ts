import { test, expect } from 'e2e/fixtures';
import { waitForASFAPIResponse } from 'e2e/helpers';

test('ERS subtype E2 filter returns matching results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ERS Primarily SAR imagery' })
    .click();

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.getByText('subtypes selected')).toContainText(
    '0/2 subtypes selected',
  );

  await page.getByText('Subtype', { exact: true }).click();
  await page.getByRole('option', { name: 'E2' }).click();
  await page.keyboard.press('Escape');

  const responsePromise = waitForASFAPIResponse(page);
  await page
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await responsePromise;

  await expect(page.locator('app-info-bar')).toContainText('Dataset: E2');
  await expect(page.locator('mat-card-header')).toContainText('E2');
});
