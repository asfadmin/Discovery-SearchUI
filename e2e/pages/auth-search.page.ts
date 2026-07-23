import { Page } from '@playwright/test';
import { extend_test as base } from 'e2e/pages/auth.page';

export const test = base.extend<{ capturedSearchPage: Page }>({
  loggedInPage: async ({ loggedInPage }, use) => {
    await loggedInPage.goto('/#/?dataset=SENTINEL-1');
    await use(loggedInPage);
  },
});
export { expect } from '@playwright/test';
