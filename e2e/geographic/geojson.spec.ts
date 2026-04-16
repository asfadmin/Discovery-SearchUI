import { test, expect } from '@playwright/test';

test('Import a geojson file', async ({ page }) => {
  await page.goto('/');
  await page.locator('app-aoi-filter').getByText('arrow_drop_down').click();

  await page
    .locator('app-aoi-filter')
    .locator('input[type="file"]')
    .setInputFiles('./e2e/geographic/assets/basic.geojson');

  await page.waitForResponse((response) =>
    response.url().includes('files_to_wkt'),
  );
  const value = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  expect(value).toContain(
    'POLYGON((-81.4332 40.7402,-81.0736 39.3257,-81.0764 39.3252,-80.706 37.8333,-80.7105 37.8325,-80.3359 36.2896,-80.3368 36.2895,-79.9815 34.7958,-79.619 33.2419,-79.2585 31.671,-76.5977 32.0786,-76.7264 32.7273,-74.7296 33.0289,-75.0274 34.5224,-75.0268 34.5226,-75.3641 36.1994,-75.6412 37.5636,-75.9475 39.0548,-75.9453 39.0556,-76.2553 40.5458,-76.253 40.5464,-76.5942 42.1636,-76.5962 42.1636,-76.9004 43.5822,-76.9002 43.5832,-76.8994 43.5834,-77.2287 45.0923,-80.4372 44.6943,-80.4377 44.6941,-80.2604 44.0462,-82.2519 43.7952,-81.8179 42.1785,-81.8088 42.1796,-81.4332 40.7402))',
  );
});
