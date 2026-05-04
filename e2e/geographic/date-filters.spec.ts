import { test, expect } from '../fixtures';

test('Set Start and End Date', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('mat-form-field')
    .filter({ hasText: 'Start DateMM/DD/YYYY' })
    .getByLabel('Open calendar')
    .nth(1)
    .click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/1/2015' }).click();
  await page
    .locator('mat-form-field')
    .filter({ hasText: 'End DateMM/DD/YYYY' })
    .getByLabel('Open calendar')
    .nth(1)
    .click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/31/2015' }).click();
  await expect(
    page.getByRole('textbox', { name: 'Start Date' }).first(),
  ).toHaveValue('1/1/2015');
  await expect(
    page.getByRole('textbox', { name: 'End Date' }).first(),
  ).toHaveValue('1/31/2015');
});

test('Clamp End Date to Start', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('mat-form-field')
    .filter({ hasText: 'Start DateMM/DD/YYYY' })
    .getByLabel('Open calendar')
    .nth(1)
    .click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/31/2015' }).click();
  await page
    .locator('mat-form-field')
    .filter({ hasText: 'End DateMM/DD/YYYY' })
    .getByLabel('Open calendar')
    .nth(1)
    .click();
  await page.getByRole('button', { name: '2015' }).click();
  await page.getByRole('button', { name: '1/1/2015', exact: true }).click();
  await page.getByRole('button', { name: '/1/2015' }).click();
  await expect(
    page.getByRole('textbox', { name: 'Start Date' }).first(),
  ).toHaveValue('1/1/2015');
  await expect(
    page.getByRole('textbox', { name: 'End Date' }).first(),
  ).toHaveValue('1/1/2015');
});

test('Invalid Dates', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('textbox', { name: 'Start Date' })
    .first()
    .fill('1/1/2000');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('textbox', { name: 'Start Date' }).first(),
  ).toHaveValue('');

  await page
    .getByRole('textbox', { name: 'End Date' })
    .first()
    .fill('1/1/3000');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('textbox', { name: 'End Date' }).first(),
  ).toHaveValue('');

  await page
    .getByRole('textbox', { name: 'Start Date' })
    .first()
    .fill('invalid date');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('textbox', { name: 'Start Date' }).first(),
  ).toHaveValue('');
  await page
    .getByRole('textbox', { name: 'Start Date' })
    .first()
    .fill('01012025');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('textbox', { name: 'Start Date' }).first(),
  ).toHaveValue('');
  await page.getByRole('textbox', { name: 'Start Date' }).first().fill('*&^*');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('textbox', { name: 'Start Date' }).first(),
  ).toHaveValue('');
});
