import { test, expect } from '@playwright/test';

test('Search button translates to BUSCAR', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page.getByRole('button', { name: 'Español' })).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'BUSCAR' }).first(),
  ).toBeVisible();
});
