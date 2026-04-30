import { test as base, Page } from '@playwright/test';
import { overrideUserCookieHeaders } from 'e2e/helpers';

export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await overrideUserCookieHeaders(page);

    await use(page);
  },
});
export { expect } from '@playwright/test';
