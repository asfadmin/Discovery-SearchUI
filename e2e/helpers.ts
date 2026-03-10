import { Page } from '@playwright/test';

export async function waitForASFAPIResponse(page: Page) {
  return page.waitForResponse((response) =>
    response.url().includes('output=jsonlite2'),
  );
}
