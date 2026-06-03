import { test, expect } from '@playwright/test';

test('Language menu styling remains the same.', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'English' }).click();
  await page.screenshot({ path: 'screenshot.png' });
});
