import { test, expect } from '@playwright/test';

test('Active/Inactive Event Filter', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  const inactiveEventIcons = page.locator(
    'app-sarviews-event img[src*="_inactive"]',
  );
  await expect(inactiveEventIcons.first()).toBeVisible({ timeout: 10_000 });

  const activeEventsToggle = page
    .getByRole('region', { name: 'Event Filters' })
    .getByRole('switch', { name: 'Active Events Only' });
  await activeEventsToggle.focus();
  await page.keyboard.press('Space');
  await expect(activeEventsToggle).toBeChecked();

  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(inactiveEventIcons).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator('app-scenes-list-header')).toContainText('Events');
});
