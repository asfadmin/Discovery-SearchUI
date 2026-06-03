import { test, expect } from '@playwright/test';

test('Main Page UI Styling remains the same.', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot();
});
