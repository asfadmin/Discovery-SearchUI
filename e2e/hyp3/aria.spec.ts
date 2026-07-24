import { test, expect } from 'e2e/fixtures';
import { loggedInSentinel1Page } from 'e2e/helpers';

test(
  'On Demand: Aria On Demand',
  { tag: ['@auth', '@webgl'] },
  async ({ page }) => {
    const loggedInPage = await loggedInSentinel1Page(page);

    await loggedInPage.route('**ARIA_S1_GUNW/**.geojson', async (request) => {
      await request.fulfill({
        path: 'e2e/hyp3/assets/aria_frame_map.geojson',
      });
    });
    await loggedInPage.getByRole('button', { name: 'Sentinel-' }).click();
    await loggedInPage
      .getByRole('menuitem', { name: 'ARIA S1 GUNW NISAR-format' })
      .click();
    await loggedInPage.getByRole('switch', { name: 'On Demand' }).click();
    await loggedInPage.waitForTimeout(1000);
    await loggedInPage.mouse.click(790, 503);
    await loggedInPage
      .getByRole('button', { name: 'Build SBAS SLC Stack' })
      .click();
    await expect(
      loggedInPage.locator('app-search-type-selector'),
    ).toContainText('SBAS Search'); // just check that we made it to SBAS for now
  },
);
