import { test, expect } from '@playwright/test';

test('Date Filter', async ({ page }) => {
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
  const startDate = eventHeader.getByRole('textbox', { name: 'Start Date' });
  const endDate = eventHeader.getByRole('textbox', { name: 'End Date' });
  const searchButton = eventHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' });

  await startDate.fill('1/1/18');
  await endDate.fill('1/1/2020');
  await page.keyboard.press('Tab');

  await searchButton.click();

  await expect(startDate).toHaveValue('1/1/2018');
  await expect(endDate).toHaveValue('1/1/2020');
  await expect
    .poll(() => page.url(), { timeout: 10_000 })
    .not.toBe(defaultUrl);
  await expect
    .poll(() => getHashParams().get('start'), { timeout: 10_000 })
    .toContain('2018-01-01');
  await expect
    .poll(() => getHashParams().get('end'), { timeout: 10_000 })
    .not.toBe('');
  await expect
    .poll(() => getHashParams().get('end'), { timeout: 10_000 })
    .toContain('2020-01-02');
});
