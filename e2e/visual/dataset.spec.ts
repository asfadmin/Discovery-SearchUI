import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test(
  'Ensure dataset menu styling remains unchanged.',
  { tag: '@visual' },
  async ({ page }) => {
    await sentinel1Page(page);

    await page.getByRole('button', { name: 'Sentinel-' }).click();
    await expect(page).toHaveScreenshot();
  },
);
