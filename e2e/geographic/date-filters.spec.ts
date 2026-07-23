import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('Set Start and End Date', { tag: '@visual' }, async ({ page }) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const filtersDropdown = page.locator('app-filters-dropdown');
  const startDate = filtersDropdown.getByRole('textbox', {
    name: 'Start Date',
  });
  const endDate = filtersDropdown.getByRole('textbox', { name: 'End Date' });
  const openStartDateCalendar = filtersDropdown.getByLabel(
    'Open start date calendar',
  );
  const openEndDateCalendar = filtersDropdown.getByLabel(
    'Open end date calendar',
  );
  await expect(page).toHaveScreenshot();

  await openStartDateCalendar.click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/1/2015' }).click();

  await openEndDateCalendar.click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/31/2015' }).click();
  await expect(page).toHaveScreenshot();

  await expect(startDate).toHaveValue('1/1/2015');
  await expect(endDate).toHaveValue('1/31/2015');
});

test('Clamp End Date to Start', async ({ page }) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const filtersDropdown = page.locator('app-filters-dropdown');
  const startDate = filtersDropdown.getByRole('textbox', {
    name: 'Start Date',
  });
  const endDate = filtersDropdown.getByRole('textbox', { name: 'End Date' });
  const openStartDateCalendar = filtersDropdown.getByLabel(
    'Open start date calendar',
  );
  const openEndDateCalendar = filtersDropdown.getByLabel(
    'Open end date calendar',
  );

  await openStartDateCalendar.click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/31/2015' }).click();

  await openEndDateCalendar.click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/1/2015' }).click();

  await expect(startDate).toHaveValue('1/1/2015');
  await expect(endDate).toHaveValue('1/1/2015');
});

test('Invalid Dates', async ({ page }) => {
  await standardizedPage(page);

  const filtersDropdown = page.locator('app-filters-dropdown');
  const startDate = filtersDropdown.getByRole('textbox', {
    name: 'Start Date',
  });
  const endDate = filtersDropdown.getByRole('textbox', { name: 'End Date' });

  await startDate.fill('1/1/2000');
  await page.keyboard.press('Tab');
  await expect(startDate).toHaveValue('');

  await endDate.fill('1/1/3000');
  await page.keyboard.press('Tab');
  await expect(endDate).toHaveValue('');

  await startDate.fill('invalid date');
  await page.keyboard.press('Tab');
  await expect(startDate).toHaveValue('');
  await startDate.fill('01012025');
  await page.keyboard.press('Tab');
  await expect(startDate).toHaveValue('');
  await startDate.fill('*&^*');
  await page.keyboard.press('Tab');
  await expect(startDate).toHaveValue('');
});
