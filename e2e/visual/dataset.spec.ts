import { test, expect } from 'e2e/fixtures';

test(
  'Ensure dataset menu styling remains unchanged.',
  { tag: '@visual' },
  async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sentinel-' }).click();
    expect(page).toHaveScreenshot();
  },
);
