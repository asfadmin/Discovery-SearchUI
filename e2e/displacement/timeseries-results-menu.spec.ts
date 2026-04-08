import { test, expect } from '@playwright/test';

const DISPLACEMENT_URL =
  '/#/?searchType=Displacement&dispOverview=VEL&maxResults=250&resultsLoaded=true';
const NETCDF_API_GLOB = 'https://d8itg4twhevb5.cloudfront.net/**';

const MOCK_TIMESERIES_RESPONSE = {
  'OPERA_L3_DISP-S1_IW_F09167_VV_20160708T005153Z_20160801T005155Z_v1.0_20250412T230329Z.nc':
    {
      secondary_datetime: '2016-08-01T00:51:55',
      short_wavelength_displacement: 0.005,
      temporal_coherence: 0.92,
      interferometric_correlation: 0.87,
      persistent_scatterer_mask: 1,
      temporal_baseline: 24,
      bytes: 2048,
      netcdf_uri: 's3://bucket/file.nc',
      reference_datetime: '2016-07-08T00:51:53',
      x: -125.619,
      y: 51.862,
    },
};

async function goToDisplacement(page: any) {
  await page.goto(DISPLACEMENT_URL);
  await page
    .getByRole('button', { name: 'Displacement' })
    .waitFor({ state: 'visible' });
  await page.evaluate(() => localStorage.removeItem('timeseries-points'));
  await page.reload();
  await page
    .locator('app-timeseries-results-menu')
    .waitFor({ state: 'attached', timeout: 15_000 });
}

async function mockNetcdfApi(page: any) {
  await page.route(NETCDF_API_GLOB, (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_TIMESERIES_RESPONSE),
    });
  });
}

async function addSeriesViaMapClick(page: any) {
  await page.mouse.move(800, 600);
  await page.mouse.down();
  await page.mouse.up();
}

test.describe('Timeseries Results Menu', () => {
  test.beforeEach(async ({ page }) => {
    await goToDisplacement(page);
  });

  test('shows snackbar prompting map click when no series are loaded', async ({
    page,
  }) => {
    await expect(page.locator('mat-snack-bar-container')).toContainText(
      'Please select a point on the map.',
      { timeout: 10_000 },
    );
  });

  test('shows series list and chart after a map click', async ({ page }) => {
    await mockNetcdfApi(page);
    await addSeriesViaMapClick(page);

    await expect(
      page.getByRole('checkbox', { name: /Frame:/ }),
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      page.getByRole('checkbox', { name: 'All AOIs' }),
    ).toBeVisible();
    await expect(page.locator('app-timeseries-chart')).toBeAttached();
  });

  test('TSRESULTS panel gets visible class after a series is added', async ({
    page,
  }) => {
    await mockNetcdfApi(page);
    await addSeriesViaMapClick(page);

    await expect(
      page.getByRole('checkbox', { name: /Frame:/ }),
    ).toBeVisible({ timeout: 30_000 });

    await expect(page.locator('#TSRESULTS')).toHaveClass(/visible/);
  });

  test('snackbar is dismissed once a series loads', async ({ page }) => {
    await mockNetcdfApi(page);
    await addSeriesViaMapClick(page);

    await expect(
      page.getByRole('checkbox', { name: /Frame:/ }),
    ).toBeVisible({ timeout: 30_000 });

    await expect(page.locator('mat-snack-bar-container')).not.toBeVisible();
  });

  test('All AOIs checkbox is checked when all series are checked', async ({
    page,
  }) => {
    await mockNetcdfApi(page);
    await addSeriesViaMapClick(page);

    await expect(
      page.getByRole('checkbox', { name: /Frame:/ }),
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      page.getByRole('checkbox', { name: 'All AOIs' }),
    ).toBeChecked();
  });

  test('unchecking All AOIs unchecks all series', async ({ page }) => {
    await mockNetcdfApi(page);
    await addSeriesViaMapClick(page);

    const frameCheckbox = page.getByRole('checkbox', { name: /Frame:/ });
    await expect(frameCheckbox).toBeVisible({ timeout: 30_000 });

    await page.getByRole('checkbox', { name: 'All AOIs' }).click();
    await expect(frameCheckbox).not.toBeChecked();
  });

  test('data credit links are present in the chart panel', async ({ page }) => {
    await mockNetcdfApi(page);
    await addSeriesViaMapClick(page);

    await expect(
      page.getByRole('checkbox', { name: /Frame:/ }),
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      page.getByRole('link', { name: /Data courtesy of.*OPERA/i }),
    ).toBeVisible();
    await expect(
      page.locator('.data-credit').getByText(/Disclaimer/i),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /License/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /DISP DOI/i }),
    ).toBeVisible();
  });

  test('OPERA data credit link points to the JPL OPERA product page', async ({
    page,
  }) => {
    await mockNetcdfApi(page);
    await addSeriesViaMapClick(page);

    await expect(
      page.getByRole('checkbox', { name: /Frame:/ }),
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      page.getByRole('link', { name: /Data courtesy of.*OPERA/i }),
    ).toHaveAttribute(
      'href',
      'https://www.jpl.nasa.gov/go/opera/products/disp-product-suite/',
    );
  });

  test.describe('delete-all confirmation dialog', () => {
    test('opens on trash-can click and shows confirmation message', async ({
      page,
    }) => {
      await mockNetcdfApi(page);
      await addSeriesViaMapClick(page);

      await expect(
        page.getByRole('checkbox', { name: /Frame:/ }),
      ).toBeVisible({ timeout: 30_000 });

      await page.locator('span.parent-checkbox-section').hover();
      await page.locator('button.delete-all-btn2').click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog')).toContainText(
        'Do you want to delete all series?',
      );
    });

    test('Cancel closes dialog without removing series', async ({ page }) => {
      await mockNetcdfApi(page);
      await addSeriesViaMapClick(page);

      await expect(
        page.getByRole('checkbox', { name: /Frame:/ }),
      ).toBeVisible({ timeout: 30_000 });

      await page.locator('span.parent-checkbox-section').hover();
      await page.locator('button.delete-all-btn2').click();
      await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(
        page.getByRole('checkbox', { name: /Frame:/ }),
      ).toBeVisible();
    });

    test('Delete clears all series, hides the panel, and restores snackbar', async ({
      page,
    }) => {
      await mockNetcdfApi(page);
      await addSeriesViaMapClick(page);

      await expect(
        page.getByRole('checkbox', { name: /Frame:/ }),
      ).toBeVisible({ timeout: 30_000 });

      await page.locator('span.parent-checkbox-section').hover();
      await page.locator('button.delete-all-btn2').click();
      await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(page.locator('#TSRESULTS')).toHaveClass(/hidden/);
      await expect(page.locator('mat-snack-bar-container')).toContainText(
        'Please select a point on the map.',
      );
    });
  });
});
