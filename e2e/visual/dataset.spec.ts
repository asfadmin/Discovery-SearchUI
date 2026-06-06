import { test, expect } from 'e2e/fixtures';

test('test', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  expect(page).toHaveScreenshot();
});
