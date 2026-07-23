import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test('Language preference persists across reload', async ({ page }) => {
  await standardizedPage(page);
  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();
});
