import { test, expect } from 'e2e/fixtures';
import { accessibilityScan, sentinel1Page } from 'e2e/helpers';

test(
  'Ensure python export styling remains consistent.',
  { tag: ['@visual', '@a11y'] },
  async ({ page }) => {
    await sentinel1Page(page);

    await page.locator('#mat-button-toggle-9-button').click();
    await page.getByRole('menuitem', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Export Python' }).click();
    await expect(page).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();
  },
);
