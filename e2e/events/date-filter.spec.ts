import { test, expect } from '@e2e/fixtures';

test('Date Filter', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  const eventHeader = page.locator('app-sarviews-header');
  const startDate = eventHeader.getByRole('textbox', { name: 'Start Date' });
  const endDate = eventHeader.getByRole('textbox', { name: 'End Date' });
  const resultsHeader = page.locator('app-scenes-list-header');
  const initialResultsText = (await resultsHeader.textContent()) ?? '';

  await startDate.fill('1/1/18');
  await endDate.fill('1/1/2020');
  await page.keyboard.press('Tab');

  await eventHeader
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(startDate).toHaveValue('1/1/2018');
  await expect(endDate).toHaveValue('1/1/2020');
  await expect(resultsHeader).not.toHaveText(initialResultsText, {
    timeout: 10_000,
  });
});
