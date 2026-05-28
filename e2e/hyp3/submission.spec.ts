import { test, expect } from 'e2e/pages/auth.page';

test(
  'On Demand: Geographic submit job with name',
  { tag: '@auth' },
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
        'S1B_IW_GRDH_1SDV_20161124T032008_20161124T032033_003095_005430_9906',
      );
    await loggedInPage.waitForResponse((response) =>
      response.url().includes('output=COUNT'),
    );
    const listSearchButton = loggedInPage
      .locator('#mat-button-toggle-6-button')
      .getByRole('button', { name: 'SEARCH' });
    await expect(listSearchButton).toBeEnabled();
    await listSearchButton.click();

    await loggedInPage
      .getByRole('button', {
        name: 'S1B_IW_GRDH_1SDV_20161124T03200… 9906 November 24, 2016, 03:20:08Z 0/',
      })
      .click();
    await loggedInPage.locator('.mdc-icon-button').first().click();
    await loggedInPage
      .getByRole('menuitem', { name: 'Add RTC GAMMA to On Demand' })
      .click();
    await loggedInPage.getByRole('button', { name: 'On Demand' }).click();
    await loggedInPage
      .getByRole('menuitem', { name: 'On Demand Queue' })
      .click();
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
  },
);

test(
  'On Demand: SBAS submit job',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
    await loggedInPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
      .click();
    await loggedInPage
      .getByRole('region', { name: 'Scene' })
      .getByLabel('Scene')
      .fill(
        'S1B_IW_SLC__1SDV_20210704T135937_20210704T140004_027645_034CB0_4B2C',
      );
    const sbasSearchButton = loggedInPage
      .locator('#mat-button-toggle-6-button')
      .getByRole('button', { name: 'SEARCH' });
    await expect(sbasSearchButton).toBeEnabled();
    await sbasSearchButton.click();
    await loggedInPage
      .getByRole('radio', { name: 'Add all results to On Demand' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'RTC GAMMA' }).click();

    await loggedInPage.getByRole('menuitem', { name: 'SLC jobs' }).click();
    await loggedInPage.getByRole('button', { name: 'On Demand' }).click();
    await loggedInPage
      .getByRole('menuitem', { name: 'On Demand Queue' })
      .click();
    await loggedInPage.getByRole('button', { name: 'Submit ' }).click();
    await expect(loggedInPage.locator('app-confirmation')).toContainText(
      'Submit',
    );
  },
);

test(
  'On Demand: Baseline submit job',
  { tag: '@auth' },
  async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
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
        'S1A_IW_SLC__1SSV_20150601T010209_20150601T010236_006173_00808F_20A0',
      );
    const baselineSearchButton = loggedInPage
      .locator('#mat-button-toggle-6-button')
      .getByRole('button', { name: 'SEARCH' });
    await expect(baselineSearchButton).toBeEnabled();
    await baselineSearchButton.click();
    await loggedInPage
      .getByRole('radio', { name: 'Add all results to On Demand' })
      .click();

    await loggedInPage.getByRole('menuitem', { name: 'InSAR GAMMA' }).click();
    await loggedInPage.getByRole('menuitem', { name: 'SLC Pairs' }).click();
    await loggedInPage
      .getByRole('radio', { name: 'Add all results to On Demand' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'autoRIFT' }).click();

    await loggedInPage.getByRole('menuitem', { name: 'SLC Pairs' }).click();
    await loggedInPage.getByRole('button', { name: 'On Demand' }).click();
    await loggedInPage
      .getByRole('menuitem', { name: 'On Demand Queue' })
      .click();
    await loggedInPage.getByRole('button', { name: 'Clear' }).click();
    await loggedInPage
      .getByRole('button', { name: /Clear InSAR GAMMA \(\d+\)/ })
      .click();
    await loggedInPage.getByRole('button', { name: 'Submit' }).click();
    await expect(loggedInPage.locator('app-confirmation')).toContainText(
      'Submit',
    );
  },
);
