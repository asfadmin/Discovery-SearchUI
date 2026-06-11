import { test, expect } from 'e2e/fixtures';

test('Language preference persists across reload', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();
});
