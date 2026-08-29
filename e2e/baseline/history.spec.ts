import { test, expect } from 'e2e/fixtures';
import {
  waitForASFAPIResponse,
  loggedInSentinel1Page,
  accessibilityScan,
} from 'e2e/helpers';

test(
  'Baseline: Search History',
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
      .fill(
        'S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
      );
    const searchResponse = waitForASFAPIResponse(loggedInPage);
    await loggedInPage
      .locator('app-filters-dropdown')
      .getByRole('button', { name: 'Filters panel search button' })
      .click();
    await searchResponse;
    await loggedInPage
      .getByRole('button', { name: 'automatedtesting_fullaccess' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Search History' })
      .click();
    await loggedInPage.getByText('keyboard_arrow_right').click();
    await expect(
      loggedInPage.locator('app-baseline-search-filters'),
    ).toContainText(
      'Reference: S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
    );
    await expect(loggedInPage).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();
  },
);
