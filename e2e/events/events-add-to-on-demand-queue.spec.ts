import { test, expect } from '@playwright/test';

test('Events: Add to On Demand Queue', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Event Event search harnesses' })
    .click();

  await expect(page.locator('app-scenes-list-header')).toContainText('Events');
  const onDemandActions = page
    .locator('app-scenes-list-header .list-button-group')
    .filter({ hasText: 'On Demand' });
  const onDemandButton = onDemandActions
    .locator('mat-icon')
    .filter({ hasText: /./ })
    .first();
  const rtcGammaMenuItem = page.getByRole('menuitem', {
    name: /RTC GAMMA/i,
  });
  const onDemandHeaderButton = page.getByRole('button', { name: 'ON DEMAND' });
  const processingQueue = page.locator('.processing-queue');
  const rtcGammaJobTypeButton = page.locator('.job-type--button');

  await page
    .locator('app-sarviews-header')
    .getByRole('combobox', { name: 'Event Search' })
    .fill('Albania');
  await page.getByRole('option', { name: /Albania/i }).first().click();
  await page
    .locator('app-sarviews-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();

  await expect(page.locator('.product-list-header')).toContainText('Files');

  await onDemandHeaderButton.click();
  await page.getByRole('menuitem', { name: 'On Demand Queue' }).click();
  await expect(processingQueue).toBeVisible();
  await expect(rtcGammaJobTypeButton.filter({ hasText: 'RTC GAMMA' })).toHaveCount(
    0,
  );
  await page.locator('.close-x').click();
  await expect(processingQueue).toHaveCount(0);

  await expect(onDemandButton).toHaveCount(1);

  await onDemandButton.click();
  await rtcGammaMenuItem.click();

  const addRtcJobsMenuItem = page.getByRole('menuitem', {
    name: /Add\s+\d+.*(Pair|Job|Jobs)/i,
  });

  await expect(addRtcJobsMenuItem).toBeVisible();
  const addRtcJobsText = (await addRtcJobsMenuItem.textContent()) ?? '';
  const jobCount = Number(addRtcJobsText.match(/Add\s+(\d+)/i)?.[1] ?? 0);

  expect(jobCount).toBeGreaterThan(0);

  await addRtcJobsMenuItem.click();

  await onDemandHeaderButton.click();
  await page.getByRole('menuitem', { name: 'On Demand Queue' }).click();

  await expect(processingQueue).toBeVisible();
  await expect(rtcGammaJobTypeButton).toContainText('RTC GAMMA');
  await expect(page.locator('app-processing-queue-jobs mat-list-item')).toHaveCount(
    jobCount,
  );
});
