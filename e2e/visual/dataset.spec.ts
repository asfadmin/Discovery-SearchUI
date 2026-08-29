import { test, expect } from 'e2e/fixtures';
import { accessibilityScan, sentinel1Page } from 'e2e/helpers';

test(
  'Ensure dataset menu styling remains unchanged.',
  { tag: ['@visual', '@a11y'] },
  async ({ page }) => {
    await sentinel1Page(page);

    await page.getByRole('button', { name: 'Sentinel-' }).click();
    await expect(page).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();
  },
);
