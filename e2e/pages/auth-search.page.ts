import { Page } from '@playwright/test';
import { test as base } from 'e2e/pages/auth.page';

export const test = base.extend<{ capturedSearchPage: Page }>({
  loggedInPage: async ({ loggedInPage }, use) => {
    await loggedInPage.routeFromHAR('./e2e/hars/capturedSearch.har', {
      url: '**/*/services/search/**',
      update: process.env.PLAYWRIGHT_HAR_RECORD === '1',
      notFound: 'fallback',
    });

    await use(loggedInPage);
  },
});
export { expect } from '@playwright/test';
