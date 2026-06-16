import { Page } from '@playwright/test';
import { test as base } from 'e2e/fixtures';
import sanitize from 'sanitize-filename';
export const test = base.extend<{ capturedSearchPage: Page }>({
  capturedSearchPage: async ({ page }, use, testInfo) => {
    await page.routeFromHAR(
      `./e2e/hars/${testInfo.titlePath.slice(0, -1).join('/')}/${sanitize(testInfo.title)}.har`,
      {
        url: '**/*/services/search/**',
        update: false,
        notFound: 'fallback',
      },
    );

    await use(page);
  },
});
export { expect } from '@playwright/test';
