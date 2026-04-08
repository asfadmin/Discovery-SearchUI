import { test, expect } from '@playwright/test';

test('Saved Searches Use Geocoded Information', async ({ page }) => {
  await page.goto('/');

  const loginPage = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Sign In' }).click();
  const popup = await loginPage;
  await popup.getByRole('textbox', { name: 'Username' }).fill('AutomatedTesting_FullAccess');
  await popup.getByRole('textbox', { name: 'Password' }).fill('LXYAKpxyAC8P');
  await popup.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('button', { name: 'Sign In' })).toHaveCount(0, {
    timeout: 15_000,
  });

  const aoiFilter = page.locator('app-aoi-filter');
  await aoiFilter.locator('.additional-aoi-toggle').click();

  const geocodeInput = aoiFilter
    .locator('app-geocode-selector')
    .getByLabel('Search for a location');
  await geocodeInput.fill('Red Dog Mine');
  await page.getByRole('option').first().click();

  await expect(aoiFilter.locator('input[name="searchPolygon"]')).toHaveValue(
    /POINT\(-162\.8591 68\.0724\)/,
  );

  await page
    .locator('app-dataset-header app-search-button .arrow-button-toggle')
    .click();
  await page.getByRole('menuitem', { name: 'Saved Searches' }).click();
  await page.getByRole('menuitem', { name: 'Save Search' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('POINT');

  await dialog.getByRole('button', { name: 'Save Search' }).click();
});
