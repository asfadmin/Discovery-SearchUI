import { Page } from '@playwright/test';

export async function waitForASFAPIResponse(page: Page) {
  return page.waitForResponse((response) =>
    response.url().includes('output=jsonlite2'),
  );
}

export async function overrideUserCookieHeaders(page: Page) {
  await page.route('**appdata-**/info/cookie', async (route) => {
    const response = await route.fetch();
    const url = new URL(page.url()).origin;
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        'Access-Control-Allow-Origin': url,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  });
}
