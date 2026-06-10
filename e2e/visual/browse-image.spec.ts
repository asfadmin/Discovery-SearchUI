import { test, expect } from 'e2e/fixtures';

test(
  'Ensure browse image styling remains unchanged.',
  { tag: '@visual' },
  async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Geographic Search' }).click();
    await page
      .getByRole('menuitem', { name: 'List List search allows you' })
      .click();
    await page.getByRole('textbox', { name: 'List of scene names' }).click();
    await page
      .getByRole('textbox', { name: 'List of scene names' })
      .press('ControlOrMeta+m');
    // TODO: Ideally we aren't firing off this request in vertex, but for now we do
    await page.waitForResponse((response) =>
      response.url().includes('output=COUNT'),
    );
    await page
      .getByRole('textbox', { name: 'List of scene names' })
      .fill(
        'S1D_EW_GRDM_1SSH_20260605T020016_20260605T020120_003094_0055BC_C653',
      );
    await page
      .getByRole('button', { name: 'Filters panel search button' })
      .click();
    await page
      .getByRole('img', { name: 'Sentinel1 scene browse image' })
      .click();

    await expect(page).toHaveScreenshot();
  },
);
