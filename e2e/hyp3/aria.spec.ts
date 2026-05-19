import { test, expect } from 'e2e/pages/auth.page';
test(
  'On Demand: Aria On Demand',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
    await loggedInPage.route(
      '**ARIA_S1_GUNW/ascending.geojson',
      async (request) => {
        const response = await request.fetch();
        await request.fulfill({
          response,
          headers: {
            ...response.headers(),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
          },
        });
      },
    );
    await loggedInPage.getByRole('button', { name: 'Sentinel-' }).click();
    await loggedInPage
      .getByRole('menuitem', { name: 'ARIA S1 GUNW NISAR-format' })
      .click();
    await loggedInPage.getByRole('switch', { name: 'On Demand' }).click();
    await loggedInPage.waitForResponse('**ARIA_S1_GUNW/ascending.geojson');

    await loggedInPage
      .locator('canvas')
      .nth(1)
      .click({
        position: {
          x: 790,
          y: 347,
        },
      });
    await loggedInPage
      .getByRole('button', { name: 'Build SBAS SLC Stack' })
      .click();
    await expect(
      loggedInPage.locator('app-search-type-selector'),
    ).toContainText('SBAS Search'); // just check that we made it to SBAS for now
  },
);
