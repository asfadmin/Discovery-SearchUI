import { test, expect } from '@playwright/test';

test('Active/Inactive Event Filter', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText(
    /\d+\s+Events?/,
  );

  const getHashParams = () => {
    const [, hash = ''] = page.url().split('#/');
    return new URLSearchParams(hash.startsWith('?') ? hash.slice(1) : hash);
  };

  const defaultUrl = page.url();
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

  await expect
    .poll(() => inactiveEventIcons.count(), { timeout: 10_000 })
    .toBeGreaterThan(0);

  await activeEventsToggle.focus();
  await page.keyboard.press('Space');
  await expect(activeEventsToggle).toBeChecked();

  await searchButton.click();

  await expect
    .poll(() => page.url(), { timeout: 10_000 })
    .not.toBe(defaultUrl);
  await expect
    .poll(() => getHashParams().get('activeEvents'), { timeout: 10_000 })
    .toBe('true');
  await expect(inactiveEventIcons).toHaveCount(0, { timeout: 10_000 });
});
