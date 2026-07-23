import { test, expect } from 'e2e/fixtures';
import { login, standardizedPage } from 'e2e/helpers';

test('Geo: Saved Filters', { tag: ['@auth', '@visual'] }, async ({ page }) => {
  const loggedInPage = await standardizedPage(await login(page));

  await loggedInPage
    .getByRole('button', { name: 'Filters', exact: true })
    .click();
  await loggedInPage
    .locator('div')
    .filter({ hasText: /^File Type$/ })
    .first()
    .click();
  await loggedInPage
    .getByRole('option', { name: 'L1 Detected High-Res Dual-Pol' })
    .click();
  await loggedInPage.locator('.cdk-overlay-backdrop').click();
  await loggedInPage
    .locator(
      '.dataset-filters-card .footer app-search-button .arrow-button-toggle',
    )
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'Save Filters' }).click();
  await loggedInPage.getByRole('button', { name: 'Save Filters' }).click();
  await loggedInPage.getByText('keyboard_arrow_right').click();
  await expect(
    loggedInPage.locator('app-geographic-search-filters'),
  ).toContainText('File Types: GRD_HD');

  await loggedInPage.evaluate(() => window.scrollTo(0, 0)); // Reset viewport position to prevent overflow
  await loggedInPage.mouse.move(0, 0);
  await expect(loggedInPage).toHaveScreenshot();
});
