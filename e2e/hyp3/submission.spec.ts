import { test, expect } from 'e2e/fixtures';
import { loggedInSentinel1Page } from 'e2e/helpers';

test(
  'On Demand: Geographic submit job with name',
  { tag: ['@auth', '@visual'] },
  async ({ page }) => {
    const loggedInPage = await loggedInSentinel1Page(page);

    await loggedInPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'List List search allows you' })
      .click();

    await loggedInPage
      .getByRole('textbox', { name: 'List of scene names' })
      .fill(
        'S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906',
      );
    await expect(loggedInPage).toHaveScreenshot();

    await loggedInPage.waitForResponse(
      (response) =>
        response.url().includes('granule_list=') &&
        response.url().includes('output=COUNT'),
    );
    const searchButton = loggedInPage
      .locator('app-filters-dropdown')
      .locator('app-search-button');

    const listSearchButton = searchButton.getByRole('button', {
      name: 'SEARCH',
    });

    await expect(listSearchButton).toBeEnabled();
    await listSearchButton.click();

    await loggedInPage
      .locator('app-scenes-list button[mat-list-item]')
      .first()
      .click();
    await expect(loggedInPage).toHaveScreenshot();

    await loggedInPage.locator('.mdc-icon-button').first().click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Add RTC GAMMA to On Demand' })
      .click();
    await loggedInPage.getByRole('button', { name: 'On Demand' }).click();
    await expect(loggedInPage).toHaveScreenshot();

    await loggedInPage
      .getByRole('menuitem', { name: 'On Demand Queue' })
      .click();
    await expect(loggedInPage).toHaveScreenshot();

    await loggedInPage
      .getByRole('button', { name: 'Submit 1 job (5 credits)' })
      .click();
    await loggedInPage.getByRole('combobox', { name: 'PROJECT_NAME' }).click();
    await loggedInPage
      .getByRole('combobox', { name: 'PROJECT_NAME' })
      .fill('test');
    await expect(loggedInPage.locator('app-confirmation')).toContainText(
      'Submit 1 Job (5 credits)',
    );
    await expect(loggedInPage).toHaveScreenshot();
  },
);

test('On Demand: SBAS submit job', { tag: '@auth' }, async ({ page }) => {
  const loggedInPage = await loggedInSentinel1Page(page);

  await loggedInPage.getByRole('button', { name: 'Geographic Search' }).click();
  await loggedInPage
    .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
    .click();
  await loggedInPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
    );
  const searchButton = loggedInPage
    .locator('app-filters-dropdown')
    .locator('app-search-button');

  const sbasSearchButton = searchButton.getByRole('button', {
    name: 'SEARCH',
  });
  await expect(sbasSearchButton).toBeEnabled();
  await Promise.all([
    loggedInPage.waitForResponse(
      (response) =>
        response.url().includes('/services/search/baseline') &&
        response.url().includes('output=jsonlite2'),
    ),
    sbasSearchButton.click(),
  ]);
  await loggedInPage.getByLabel('Add all results to On Demand queue').click();
  await loggedInPage.getByRole('menuitem', { name: 'RTC GAMMA' }).click();

  await loggedInPage.getByRole('menuitem', { name: 'SLC jobs' }).click();
  await loggedInPage.getByRole('button', { name: 'On Demand' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'On Demand Queue' }).click();
  await loggedInPage.getByRole('button', { name: 'Submit ' }).click();
  await expect(loggedInPage.locator('app-confirmation')).toContainText(
    'Submit',
  );
});

test('On Demand: Baseline submit job', { tag: '@auth' }, async ({ page }) => {
  const loggedInPage = await loggedInSentinel1Page(page);

  await loggedInPage.getByRole('button', { name: 'Geographic Search' }).click();
  await loggedInPage
    .getByRole('menuitem', { name: 'Baseline Baseline search' })
    .click();
  await loggedInPage
    .getByRole('region', { name: 'Scene' })
    .getByLabel('Scene')
    .fill(
      'S1A_IW_SLC__1SSV_20150601T010209_20150601T010236_006173_00808F_20A0',
    );
  const searchButton = loggedInPage
    .locator('app-filters-dropdown')
    .locator('app-search-button');

  const baselineSearchButton = searchButton.getByRole('button', {
    name: 'SEARCH',
  });
  const addAllToOnDemand = loggedInPage
    .locator('app-baseline-results-menu')
    .locator('mat-button-toggle')
    .filter({
      has: loggedInPage.locator('mat-icon[svgIcon="hyp3"]'),
    })
    .first();

  await expect(baselineSearchButton).toBeEnabled();
  await Promise.all([
    loggedInPage.waitForResponse(
      (response) =>
        response.url().includes('/services/search/baseline') &&
        response.url().includes('output=jsonlite2'),
    ),
    baselineSearchButton.click(),
  ]);
  await addAllToOnDemand.click();

  await loggedInPage.getByRole('menuitem', { name: 'InSAR GAMMA' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'SLC Pairs' }).click();
  await addAllToOnDemand.click();
  await loggedInPage.getByRole('menuitem', { name: 'autoRIFT' }).click();

  await loggedInPage.getByRole('menuitem', { name: 'SLC Pairs' }).click();
  await loggedInPage.getByRole('button', { name: 'On Demand' }).click();
  await loggedInPage.getByRole('menuitem', { name: 'On Demand Queue' }).click();
  await loggedInPage.getByRole('button', { name: 'Clear' }).click();
  await loggedInPage
    .getByRole('button', { name: /Clear InSAR GAMMA \(\d+\)/ })
    .click();
  await loggedInPage.getByRole('button', { name: 'Submit' }).click();
  await expect(loggedInPage.locator('app-confirmation')).toContainText(
    'Submit',
  );
});
