import { test, expect } from 'e2e/fixtures';
import { standardizedPage } from 'e2e/helpers';

test(
  'Ensure dataset menu styling remains unchanged.',
  { tag: '@visual' },
  async ({ page }) => {
    await standardizedPage(page);

    await page.getByRole('button', { name: 'Sentinel-' }).click();
    await expect(page).toHaveScreenshot();
  },
);
