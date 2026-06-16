import { Page } from '@playwright/test';
import { test as base } from 'e2e/pages/auth.page';
import { sanitize } from 'e2e/helpers';

export const test = base.extend<{ capturedSearchPage: Page }>({
  loggedInPage: async ({ loggedInPage }, use, testInfo) => {
    await loggedInPage.routeFromHAR(
      `./e2e/hars/${testInfo.titlePath.slice(0, -1).join('/')}/${sanitize(testInfo.title)}.har`,
      {
        url: '**/*/services/search/**',
        update: false,
        notFound: 'fallback',
      },
    );

    await use(loggedInPage);
  },
});
export { expect } from '@playwright/test';
