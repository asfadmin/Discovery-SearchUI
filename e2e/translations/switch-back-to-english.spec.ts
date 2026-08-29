import { test, expect } from 'e2e/fixtures';
import { accessibilityScan, sentinel1Page } from 'e2e/helpers';

test(
  'Switch back to English works',
  { tag: ['@visual', '@a11y'] },
  async ({ page }) => {
    await sentinel1Page(page);

    await page.getByRole('button', { name: 'English' }).click();
    await expect(page).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();

    await page.getByRole('menuitem', { name: 'Español' }).click();
    await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

    await page.getByRole('button', { name: 'Español' }).click();
    await page.getByRole('menuitem', { name: 'English' }).click();
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
  },
);
