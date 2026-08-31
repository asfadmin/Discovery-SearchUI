import { setupOnDemand, loggedInSentinel1Page } from 'e2e/helpers';
import { test, expect } from 'e2e/fixtures';

test('On Demand: Add expired job', { tag: '@auth' }, async ({ page }) => {
  const loggedInPage = await loggedInSentinel1Page(page);

  await setupOnDemand(loggedInPage);
  await loggedInPage.getByRole('button', { name: 'Geographic Search' }).click();
  await loggedInPage
    .getByRole('menuitem', { name: 'On Demand Products On Demand' })
    .click();
  await expect(loggedInPage.locator('mat-list-item')).toContainText(
    'Type: RTC_GAMMA, GRD_HD',
  );
  await loggedInPage
    .locator('mat-chip.clickable')
    .filter({ hasText: 'Expired' })
    .first()
    .click();
  await loggedInPage.getByRole('menuitem', { name: 'Resubmit Job...' }).click();
  await expect(loggedInPage.locator('app-confirmation')).toContainText(
    'Submit 1 Job (5 credits)',
  );
});

test(
  'On Demand: Add previously submitted job (file panel)',
  { tag: '@auth' },
  async ({ page }) => {
    const loggedInPage = await loggedInSentinel1Page(page);

    await setupOnDemand(loggedInPage);
    await loggedInPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();
    await loggedInPage
      .getByRole('menuitem', { name: 'On Demand Products On Demand' })
      .click();
    await expect(loggedInPage.locator('mat-list-item')).toContainText(
      'Type: RTC_GAMMA, GRD_HD',
    );
    await loggedInPage
      .locator(
        '.mdc-icon-button.mat-mdc-icon-button.mat-mdc-button-base.mat-mdc-list-item-meta',
      )
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Add job' }).click();
    await loggedInPage.getByText('1 On Demand').click();
    await loggedInPage
      .getByRole('menuitem', { name: 'On Demand Queue' })
      .click();
    await expect(
      loggedInPage
        .getByLabel('On Demand Powered by HyP3')
        .locator('mat-list-item'),
    ).toContainText(
      'S1A_IW_GRDH_1SDV_20210628T015845_20210628T015910_038534_048C1A_826C',
    );
  },
);
