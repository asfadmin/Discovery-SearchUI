import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('Switch back to English works', { tag: '@visual' }, async ({ page }) => {
  await standardizedPage(page);

  await page.getByRole('button', { name: 'English' }).click();
  await expect(page).toHaveScreenshot();

  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page.getByRole('button', { name: 'Español' }).click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
});
