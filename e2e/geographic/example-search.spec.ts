import { test, expect } from '../fixtures';

// made using the playwright test generator
// loads up a browser and listens to what you click on
// https://playwright.dev/docs/codegen
test('test', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ALOS AVNIR-2 Advanced Visible' })
    .click();
  await page
    .locator('#mat-button-toggle-8-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page.getByRole('button', { name: 'ALAV2A279162270 April 21,' }).click();
  await expect(page.locator('mat-card-title')).toContainText('ALAV2A279162270');
});
