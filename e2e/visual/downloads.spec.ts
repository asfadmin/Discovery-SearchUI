import { test, expect } from '@playwright/test';

test('Ensure downloads styling remains the same.', async ({ page }) => {
  await page.goto('http://localhost:4200/#/');
  await page.getByRole('button', { name: 'Downloads' }).click();
});
