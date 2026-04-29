import { test, expect } from '@playwright/test';

test('Active/Inactive Event Filter', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  const eventHeader = page.locator('app-sarviews-header');
  const eventFilters = page.getByRole('region', { name: 'Event Filters' });
  const activeEventsToggle = eventFilters.getByRole('switch', {
    name: 'Active Events Only',
  });
  const searchButton = eventHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });
  const inactiveEventIcons = page.locator(
    'app-sarviews-event img[src*="_inactive"]',
  );

  await expect(inactiveEventIcons.first()).toBeVisible({ timeout: 10_000 });

  await activeEventsToggle.focus();
  await page.keyboard.press('Space');
  await expect(activeEventsToggle).toBeChecked();

  await searchButton.click();

  await expect(inactiveEventIcons).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator('app-scenes-list-header')).toContainText('Events');
});
