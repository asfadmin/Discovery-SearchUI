import { test, expect } from '@playwright/test';

test('Clear Search', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  const eventHeader = page.locator('app-sarviews-header');
  const eventSearch = eventHeader.getByRole('combobox', {
    name: 'Event Search',
  });
  const eventTypes = eventHeader
    .locator('app-sarviews-event-type-selector')
    .getByRole('combobox');
  const filtersSearchButton = eventHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });
  const filtersSearchMenu = eventHeader.locator(
    'app-search-button .arrow-button-toggle',
  );

  await eventSearch.fill('Alaska');
  await page.keyboard.press('Escape');
  await eventTypes.click();
  await page.getByRole('option', { name: 'Quake' }).click();
  await page.locator('.cdk-overlay-backdrop').click();

  await filtersSearchButton.click();

  await expect(eventSearch).toHaveValue('Alaska');
  await expect(eventTypes).toContainText('Quake');
  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  await filtersSearchMenu.click();
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();

  await expect(eventSearch).toHaveValue('');
  await expect(eventTypes).toContainText('Event Types');
});
