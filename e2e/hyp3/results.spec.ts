import { setupOnDemand, login, standardizedPage } from 'e2e/helpers';
import { test, expect } from 'e2e/fixtures';

test('On Demand: Zoom to results', { tag: '@auth' }, async ({ page }) => {
  const loggedInPage = await standardizedPage(await login(page));

  await setupOnDemand(loggedInPage);
  await loggedInPage.getByRole('button', { name: 'Geographic Search' }).click();
  await loggedInPage
    .getByRole('menuitem', { name: 'On Demand Products On Demand' })
    .click();
  await loggedInPage
    .getByRole('radiogroup')
    .filter({ hasText: 'settings_overscan' })
    .click();
  await loggedInPage.waitForTimeout(2000);
  await loggedInPage.mouse.move(800, 600);
  await loggedInPage.mouse.move(800, 800);
  await expect(
    loggedInPage.locator('.ol-custom-scale-line-inner'),
  ).not.toContainText('1000 km');
});
