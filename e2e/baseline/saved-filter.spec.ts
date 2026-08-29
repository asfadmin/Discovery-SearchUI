import { test, expect } from 'e2e/fixtures';
import { accessibilityScan, loggedInSentinel1Page } from 'e2e/helpers';

test(
  'Baseline: Saved filters',
  { tag: ['@auth', '@visual', '@a11y'] },
  async ({ page }) => {
    const loggedInPage = await loggedInSentinel1Page(page);

    await loggedInPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Baseline Baseline search' })
      .click();
    await loggedInPage
      .getByRole('region', { name: 'Scene' })
      .getByLabel('Scene')
      .click();
    await loggedInPage
      .getByRole('region', { name: 'Scene' })
      .getByLabel('Scene')
      .fill('R1_65192_ST6_F111');
    await loggedInPage
      .locator('app-filters-dropdown')
      .getByRole('button', { name: 'Filters panel search button' })
      .click();
    await loggedInPage
      .getByRole('radio', { name: 'Baseline Criteria' })
      .click();

    await loggedInPage.getByRole('switch', { name: 'Seasonal Search' }).click();
    await loggedInPage
      .locator(
        '.dataset-filters-card .footer app-search-button .arrow-button-toggle',
      )
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Saved Filters' }).click();
    await loggedInPage.getByRole('menuitem', { name: 'Save Filters' }).click();
    await loggedInPage.getByRole('button', { name: 'Save Filters' }).click();
    await loggedInPage.getByText('keyboard_arrow_right').click();
    await expect(loggedInPage.locator('app-save-user-filter')).toContainText(
      'Season: 1 to 180',
    );
    await expect(loggedInPage).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();
  },
);
