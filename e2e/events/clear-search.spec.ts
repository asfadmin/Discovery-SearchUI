import { test, expect } from '@playwright/test';

test('Clear Search', async ({ page }) => {
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
  const defaultParams = getHashParams();
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
  await expect
    .poll(() => page.url(), { timeout: 10_000 })
    .not.toBe(defaultUrl);
  const filteredUrl = page.url();

  await filtersSearchMenu.click();
  await page.getByRole('menuitem', { name: 'Clear Search' }).click();

  await expect(eventSearch).toHaveValue('');
  await expect(eventTypes).toContainText('Event Types');
  await expect
    .poll(() => page.url(), { timeout: 10_000 })
    .not.toBe(filteredUrl);
  await expect
    .poll(() => getHashParams().get('searchType'), { timeout: 10_000 })
    .toBe(defaultParams.get('searchType'));
  await expect
    .poll(() => getHashParams().get('eventID'), { timeout: 10_000 })
    .toBe(defaultParams.get('eventID'));
  await expect.poll(() => getHashParams().get('polygon')).toBeNull();
});
