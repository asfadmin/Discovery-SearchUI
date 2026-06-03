import { test, expect } from 'e2e/fixtures';

test('Ensure Baseline Start & End Date Filters Styling Remans Consistent', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();
  await page.getByRole('region', { name: 'Scene' }).getByLabel('Scene').click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1A_IW_SLC__1SDV_20180616T210817_20180616T210845_022387_026C91_EDAA',
    );
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();
  const baselineCriteriaButton = page.getByRole('radio', {
    name: 'Baseline Criteria',
  });
  await baselineCriteriaButton.click();
  await page.getByText('Start Date').click();
  await page.getByRole('textbox', { name: 'Start Date' }).fill('9/1/2018');
  await page.getByText('End Date').click();
  await page.getByRole('textbox', { name: 'End Date' }).fill('1/1/21');

  await expect(page).toHaveScreenshot();
});

test('Select a different reference scene and ensure styling remains the same.', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();
  await page.getByRole('region', { name: 'Scene' }).getByLabel('Scene').click();
  await page
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill('S1_049134_IW2_20230821T073937_VV_4A4C-BURST');
  await page
    .locator('app-filters-dropdown')
    .getByRole('button', { name: 'Filters panel search button' })
    .click();

  await page
    .getByRole('button', {
      name: 'S1_049134_IW2_20141124T073843_VV_1B… Nov 24 2014 -201m -3192d',
    })
    .click();

  await expect(page).toHaveScreenshot();
});
