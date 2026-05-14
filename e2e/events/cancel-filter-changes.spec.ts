import { test, expect } from 'e2e/fixtures';

test('Events: Cancel restores filter changes after editing start date', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');

  const eventHeader = page.locator('app-sarviews-header');

  await eventHeader.getByRole('button', { name: 'Filters' }).click();

  const startDate = page
    .locator('app-sarviews-filters')
    .getByRole('textbox', { name: 'Start Date' });

  await startDate.fill('1/1/2018');
  await expect(startDate).toHaveValue('1/1/2018');

  await page
    .locator('app-cancel-filter-changes')
    .getByRole('button', { name: 'Cancel' })
    .click();

  await eventHeader.getByRole('button', { name: 'Filters' }).click();
  await expect(startDate).toHaveValue('');
});
