import { test, expect } from 'e2e/fixtures';
import {
  accessibilityScan,
  nisarPage,
  waitForASFAPIResponse,
} from 'e2e/helpers';

test(
  'Test GDAL Dropdown',
  { tag: ['@visual', '@a11y'] },
  async ({ page, context, browserName }) => {
    const contextOptions =
      browserName === 'chromium' ? ['clipboard-read', 'clipboard-write'] : [];

    await context.grantPermissions(contextOptions);

    await nisarPage(page);
    await page.getByRole('button', { name: 'Geographic Search' }).click();
    await page
      .getByRole('menuitem', { name: 'List List search allows you' })
      .click();
    await page.getByRole('textbox', { name: 'List of scene names' }).click();
    await page
      .getByRole('textbox', { name: 'List of scene names' })
      .fill(
        'NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001',
      );

    const searchResponse = waitForASFAPIResponse(page);
    const searchButton = page
      .locator('app-filters-dropdown')
      .locator('app-search-button');

    await searchButton.getByRole('button', { name: 'SEARCH' }).click();
    await searchResponse;

    await page
      .getByRole('button', {
        name: 'Expand GDAL datasets dialog.',
        exact: true,
      })
      .click();
    await page
      .getByLabel('Frequency A HHHH Covariance')
      .getByLabel('Copy GDAL dataset extraction')
      .click();
    await expect(page.getByLabel('Copied GDAL snippet to')).toContainText(
      'Copied GDAL snippet to clipboard.',
    );
    await expect(page).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText.replace(/\s+/g, ' ').trim()).toEqual(
      `gdal_translate \\
         NETCDF:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH \\
         -of GTiff "NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001__science_LSAR_GCOV_grids_frequencyA_HHHH.tif" \\
         --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\
         --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\
         --config GDAL_CACHEMAX 64000000 \\
         --config GDAL_DISABLE_READDIR_ON_OPEN TRUE \\
         --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES \\
         --config GDAL_HTTP_MULTIPLEX YES \\
         --config GDAL_NUM_THREADS ALL_CPUS \\
         --config CPL_VSIL_CURL_CACHE_SIZE 1GB \\
         --config GDAL_HTTP_NETRC YES \\
         --config GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt \\
         --config GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt`
        .replace(/\s+/g, ' ')
        .trim(),
    );
  },
);

test('Test GDAL Dialog', { tag: ['@visual', '@a11y'] }, async ({ page }) => {
  await nisarPage(page);
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'List List search allows you' })
    .click();
  await page.getByRole('textbox', { name: 'List of scene names' }).click();
  await page
    .getByRole('textbox', { name: 'List of scene names' })
    .fill(
      'NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001',
    );

  const searchResponse = waitForASFAPIResponse(page);
  const searchButton = page
    .locator('app-filters-dropdown')
    .locator('app-search-button');

  await searchButton.getByRole('button', { name: 'SEARCH' }).click();
  await searchResponse;

  await page
    .getByRole('button', { name: 'Customize with GDAL', exact: true })
    .click();

  await page.getByRole('radio', { name: 'Select Frequency A HHHH' }).check();
  await page.getByText('Operating System').click();
  await page.getByRole('option', { name: 'Unix' }).click();
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdal_translate \\ HDF5:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH \\ -of GTiff "NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001__science_LSAR_GCOV_grids_frequencyA_HHHH.tif" \\ --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\ --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\ --config GDAL_CACHEMAX 64000000 \\ --config GDAL_DISABLE_READDIR_ON_OPEN TRUE \\ --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES \\ --config GDAL_HTTP_MULTIPLEX YES \\ --config GDAL_NUM_THREADS ALL_CPUS \\ --config CPL_VSIL_CURL_CACHE_SIZE 1GB \\ --config GDAL_HTTP_NETRC YES \\ --config GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt \\ --config GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt',
  );
  await expect(page).toHaveScreenshot();
  expect(await accessibilityScan(page)).toMatchSnapshot();

  await page.getByText('GDAL Version').click();
  await page.getByRole('option', { name: '<' }).click();
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdal_translate \\ NETCDF:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH \\ -of GTiff "NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001__science_LSAR_GCOV_grids_frequencyA_HHHH.tif" \\ --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\ --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\ --config GDAL_CACHEMAX 64000000 \\ --config GDAL_DISABLE_READDIR_ON_OPEN TRUE \\ --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES \\ --config GDAL_HTTP_MULTIPLEX YES \\ --config GDAL_NUM_THREADS ALL_CPUS \\ --config CPL_VSIL_CURL_CACHE_SIZE 1GB \\ --config GDAL_HTTP_NETRC YES \\ --config GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt \\ --config GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt',
  );
  await page.getByText('GDAL Version').click();
  await page.getByRole('option', { name: '≥' }).click();

  await page.getByText('File Format').click();
  await page.getByText('COG').click();
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdal_translate \\ HDF5:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH \\ -of COG "NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001__science_LSAR_GCOV_grids_frequencyA_HHHH.tif" \\ --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\ --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\ --config GDAL_CACHEMAX 64000000 \\ --config GDAL_DISABLE_READDIR_ON_OPEN TRUE \\ --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES \\ --config GDAL_HTTP_MULTIPLEX YES \\ --config GDAL_NUM_THREADS ALL_CPUS \\ --config CPL_VSIL_CURL_CACHE_SIZE 1GB \\ --config GDAL_HTTP_NETRC YES \\ --config GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt \\ --config GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt',
  );
  await page.getByText('File Format').click();
  await page.getByRole('option', { name: 'GTiff' }).click();

  await page.getByText('Output Projection').click();
  await page.getByRole('textbox', { name: 'Output Projection' }).fill('WGS84');
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdalwarp \\ HDF5:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH \\ -of GTiff "NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001__science_LSAR_GCOV_grids_frequencyA_HHHH.tif" \\ -t_srs WGS84 \\ -dstalpha \\ --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\ --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\ --config GDAL_CACHEMAX 64000000 \\ --config GDAL_DISABLE_READDIR_ON_OPEN TRUE \\ --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES \\ --config GDAL_HTTP_MULTIPLEX YES \\ --config GDAL_NUM_THREADS ALL_CPUS \\ --config CPL_VSIL_CURL_CACHE_SIZE 1GB \\ --config GDAL_HTTP_NETRC YES \\ --config GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt \\ --config GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt',
  );
  await page.getByRole('textbox', { name: 'Output Projection' }).click();
  await page.getByRole('textbox', { name: 'Output Projection' }).fill('');

  await page.getByRole('checkbox', { name: 'Use Config File' }).check();
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    '~/.netrc file_copy',
  );
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdal_translate \\ HDF5:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH \\ -of GTiff "NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001__science_LSAR_GCOV_grids_frequencyA_HHHH.tif"',
  );
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'CPL_VSIL_CURL_CHUNK_SIZE 2097152 CPL_VSIL_CURL_CACHE_SIZE 67108864 GDAL_CACHEMAX 64000000 GDAL_DISABLE_READDIR_ON_OPEN TRUE GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES GDAL_HTTP_MULTIPLEX YES GDAL_NUM_THREADS ALL_CPUS CPL_VSIL_CURL_CACHE_SIZE 1GB GDAL_HTTP_NETRC YES GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt',
  );
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    '~/.gdal/gdalrc file_copy',
  );

  await page.getByText('Operating System').click();
  await page.getByRole('option', { name: 'Windows' }).click();
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    '%USERPROFILE%/.netrc file_copy',
  );
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdal_translate ^ HDF5:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH ^ -of GTiff "NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001__science_LSAR_GCOV_grids_frequencyA_HHHH.tif"',
  );
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    '%USERPROFILE%/.gdal/gdalrc file_copy',
  );
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'CPL_VSIL_CURL_CHUNK_SIZE 2097152 CPL_VSIL_CURL_CACHE_SIZE 67108864 GDAL_CACHEMAX 64000000 GDAL_DISABLE_READDIR_ON_OPEN TRUE GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES GDAL_HTTP_MULTIPLEX YES GDAL_NUM_THREADS ALL_CPUS CPL_VSIL_CURL_CACHE_SIZE 1GB GDAL_HTTP_NETRC YES GDAL_HTTP_COOKIEFILE %TEMP%/gdal_cookies.txt GDAL_HTTP_COOKIEJAR %TEMP%/gdal_cookies.txt',
  );
  await page.getByText('Operating System').click();
  await page.getByRole('option', { name: 'Unix' }).click();
  await page.getByRole('checkbox', { name: 'Use Config File' }).uncheck();

  await page.getByRole('textbox', { name: 'Output Filename' }).click();
  await page
    .getByRole('textbox', { name: 'Output Filename' })
    .fill('output.tif');
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdal_translate \\ HDF5:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HHHH \\ -of GTiff "output.tif" \\ --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\ --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\ --config GDAL_CACHEMAX 64000000 \\ --config GDAL_DISABLE_READDIR_ON_OPEN TRUE \\ --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES \\ --config GDAL_HTTP_MULTIPLEX YES \\ --config GDAL_NUM_THREADS ALL_CPUS \\ --config CPL_VSIL_CURL_CACHE_SIZE 1GB \\ --config GDAL_HTTP_NETRC YES \\ --config GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt \\ --config GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt',
  );
  await page.getByRole('radio', { name: 'Select Frequency A HVHV' }).check();
  await expect(page.locator('app-gdal-customize-dialog')).toContainText(
    'gdal_translate \\ HDF5:"/vsicurl/https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001/NISAR_L2_PR_GCOV_028_128_D_076_4005_DHDH_A_20260822T021004_20260822T021029_P05023_N_P_J_001.h5"://science/LSAR/GCOV/grids/frequencyA/HVHV \\ -of GTiff "output.tif" \\ --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\ --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\ --config GDAL_CACHEMAX 64000000 \\ --config GDAL_DISABLE_READDIR_ON_OPEN TRUE \\ --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES \\ --config GDAL_HTTP_MULTIPLEX YES \\ --config GDAL_NUM_THREADS ALL_CPUS \\ --config CPL_VSIL_CURL_CACHE_SIZE 1GB \\ --config GDAL_HTTP_NETRC YES \\ --config GDAL_HTTP_COOKIEFILE /tmp/gdal_cookies.txt \\ --config GDAL_HTTP_COOKIEJAR /tmp/gdal_cookies.txt',
  );
});
