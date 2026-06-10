import { test, expect } from 'e2e/fixtures';

test(
  'Ensure api export styling remains unchanged.',
  { tag: '@visual' },
  async ({ page }) => {
    await page.goto('/');
    await page.locator('#mat-button-toggle-9-button').click();
    await page.getByRole('menuitem', { name: 'Export' }).click();
    await page.getByRole('menuitem', { name: 'Export API' }).click();

    await expect(page).toHaveScreenshot();
  },
);
