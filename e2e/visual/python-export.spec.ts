import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test(
  'Ensure python export styling remains consistent.',
  { tag: '@visual' },
  async ({ page }) => {
    await sentinel1Page(page);

    await page.locator('#mat-button-toggle-9-button').click();
    await page.getByRole('menuitem', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Export Python' }).click();
    await expect(page).toHaveScreenshot();
  },
);
