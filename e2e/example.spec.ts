import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/ASF Data Search/);
  await expect(page).toHaveScreenshot();
});
