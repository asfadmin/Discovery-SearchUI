import { test, expect } from 'e2e/pages/search.page';

test(
  'SBAS: Download All Pairs',
  { tag: '@visual' },
  async ({ capturedSearchPage }) => {
    await capturedSearchPage.goto('/');
    await capturedSearchPage
      .getByRole('button', { name: 'Geographic Search' })
      .click();
    await capturedSearchPage
      .getByRole('menuitem', { name: 'SBAS SBAS search provides' })
      .click();
    await capturedSearchPage
      .getByRole('region', { name: 'Scene' })
      .getByLabel('Scene')
      .fill(
        'S1A_IW_SLC__1SDV_20200710T150225_20200710T150252_033394_03DE82_92BB',
      );
    await capturedSearchPage
      .locator('app-filters-dropdown')
      .getByRole('button', { name: 'Filters panel search button' })
      .click();

    const scenesListHeader = capturedSearchPage.locator(
      'app-scenes-list-header',
    );
    await expect(scenesListHeader).toContainText(/\d+\s+Pairs?/i);

    const queueButton = scenesListHeader
      .locator('.list-button-group')
      .filter({ hasText: /QUEUE/i })
      .locator('mat-button-toggle.control-mat-button-toggle');
    await queueButton.click();

    const addMenuItem = capturedSearchPage.getByRole('menuitem', {
      name: /Add [1-9]\d* Files to downloads/,
    });
    const menuText = (await addMenuItem.textContent()) ?? '';
    const fileCount = menuText.match(/Add ([1-9]\d*)/)?.[1];
    expect(fileCount).toBeTruthy();
    await addMenuItem.click();

    await capturedSearchPage.getByRole('button', { name: 'Downloads' }).click();

    await expect(capturedSearchPage.locator('.dl-subtitle')).toContainText(
      `${fileCount} Files`,
    );
    await expect(
      capturedSearchPage.locator('.dl-mat-dialog-content mat-list-item'),
    ).toHaveCount(Number(fileCount));

    await expect(capturedSearchPage).toHaveScreenshot();
  },
);
