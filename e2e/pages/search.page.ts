import { Page } from '@playwright/test';
import { test as base } from 'e2e/fixtures';

export const test = base.extend<{ capturedSearchPage: Page }>({
  capturedSearchPage: async ({ page }, use) => {
    await page.goto('/#/?dataset=SENTINEL-1');
    await page.waitForLoadState('networkidle');

    await use(page);
  },
});
export { expect } from '@playwright/test';
