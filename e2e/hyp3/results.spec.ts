import { setupOnDemand } from 'e2e/helpers';
import { test, expect } from 'e2e/pages/auth.page';

test(
  'On Demand: Zoom to results',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
    await setupOnDemand(loggedInPage);
    await loggedInPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'On Demand Products On Demand' })
      .click();
    await loggedInPage
      .getByRole('radiogroup')
      .filter({ hasText: 'settings_overscan' })
      .click();
    await loggedInPage.waitForTimeout(2000);
    await loggedInPage.mouse.move(800, 600);
    await expect(loggedInPage.locator('app-map-info')).toContainText('20 m');
  },
);
