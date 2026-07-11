import { test, expect } from 'e2e/pages/auth.page';

test(
  'Profile: List save scenes',
  { tag: ['@auth', '@visual'] },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
    await loggedInPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();

    await loggedInPage
      .getByRole('menuitem', { name: 'List List search allows you' })
      .click();
    await loggedInPage
      .getByRole('textbox', { name: 'List of scene names' })
      .fill(
        'S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906, S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1, ALPSRP111041130S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906, S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1, ALPSRP111041130',
      );
    await expect(
      loggedInPage.locator('app-max-results-selector'),
    ).toContainText('10 Files');

    await loggedInPage
      .locator(
        'app-filters-dropdown app-search-button #dataset-button-toggle-group .arrow-button-toggle',
      )
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Save Search' }).click();
    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
    await loggedInPage.getByText('keyboard_arrow_right').click();
    await expect(loggedInPage.locator('app-saved-search')).toContainText(
      '4 Scenes',
    );
    await expect(loggedInPage).toHaveScreenshot();
    await expect(loggedInPage.locator('app-list-search-filters')).toContainText(
      'List Type: Scene S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906 S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1 ALPSRP111041130S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906 ALPSRP111041130',
    );
  },
);

test(
  'Profile: List save files',
  { tag: ['@auth', '@visual'] },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
    await loggedInPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();

    await loggedInPage
      .getByRole('menuitem', { name: 'List List search allows you' })
      .click();
    await loggedInPage.getByRole('radio', { name: 'File' }).click();
    await loggedInPage
      .getByRole('textbox', { name: 'List of File IDs' })
      .click();
    await loggedInPage
      .getByRole('textbox', { name: 'List of File IDs' })
      .fill(
        'S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906-GRD_HD, S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1-unwrappedPhase, ALPSRP111041130-RTC_HI_RESS1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906-GRD_HD, S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1-unwrappedPhase, ALPSRP111041130-RTC_HI_RES',
      );
    await expect(
      loggedInPage.locator('app-max-results-selector'),
    ).toContainText('2 Files');
    await loggedInPage
      .locator(
        'app-filters-dropdown app-search-button #dataset-button-toggle-group .arrow-button-toggle',
      )
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Saved Searches' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Save Search' }).click();
    await loggedInPage.getByRole('button', { name: 'Save Search' }).click();
    await loggedInPage.getByText('keyboard_arrow_right').click();
    await expect(loggedInPage.locator('app-saved-search')).toContainText(
      '4 Products',
    );
    await expect(loggedInPage).toHaveScreenshot();
    await expect(loggedInPage.locator('app-list-search-filters')).toContainText(
      'List Type: Product S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906-GRD_HD S1-GUNW-D-R-087-tops-20190301_20190223-161540-20645N_18637N-PP-7a85-v2_0_1-unwrappedPhase ALPSRP111041130-RTC_HI_RESS1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906-GRD_HD ALPSRP111041130-RTC_HI_RES',
    );
  },
);
