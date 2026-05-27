import { test, expect } from 'e2e/fixtures';

test.use({ viewport: { width: 1600, height: 1200 } });

test('Area of interest should parse polygon coordinate strings', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      '-53.26,64.81,-48.1,60.33,-42.58,59.93,-40.94,63.63,-37.18,65.91,-31.29,67.17,-26.02,68.68,- 21.97,70.57,-18.28,75.06,-17.05,77.04,-19.78,78.79,-10.72,81.55,-20.83,82.4,-25.44,83.13,-31.82,83.63,- 43.95,83.23,-61.17,81.84,-66.58,80.39,-66.2,79.47,-74.09,78.37,-69.26,76.12,-61.08,76.1,-54.71,72.83,- 55.04,71.55,-53.26,64.81',
    );
  await page
    .locator('app-dataset-header')
    .locator('app-search-button')
    .getByRole('button', { name: 'SEARCH' })
    .focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const value = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(value).toContain(
    'POLYGON((-53.26 64.81,-48.1 60.33,-42.58 59.93,-40.94 63.63,-37.18 65.91,-31.29 67.17,-26.02 68.68,-21.97 70.57,-18.28 75.06,-17.05 77.04,-19.78 78.79,-10.72 81.55,-20.83 82.4,-25.44 83.13,-31.82 83.63,-43.95 83.23,-61.17 81.84,-66.58 80.39,-66.2 79.47,-74.09 78.37,-69.26 76.12,-61.08 76.1,-54.71 72.83,-55.04 71.55,-53.26 64.81))',
  );
});

test('Manual Entry Cases, (Self-Intersecting, clear, valid)', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();

  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'POLYGON((-114.4775 55.628,-95.2734 54.5721,-114.0381 41.1456,-97.251 41.1125,-114.4775 55.628))',
    );
  await page.keyboard.press('Tab');
  await expect(
    page
      .locator('app-dataset-header')
      .locator('app-search-button')
      .getByRole('button'),
  ).toHaveText('NO RESULTS');

  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  let value = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(value).toBe('');
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'POLYGON((-148.8144 64.3268,-146.5039 64.3268,-146.5039 65.2329,-148.8144 65.2329,-148.8144 64.3268))',
    );

  await page.getByRole('combobox', { name: 'Search for a location' }).click();
  value = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(value).toBe(
    'POLYGON((-148.8144 64.3268,-146.5039 64.3268,-146.5039 65.2329,-148.8144 65.2329,-148.8144 64.3268))',
  );
});

test('Invalid Manual Entry', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill('-122.255 38.959,-97.470 13.239');

  await page.getByRole('combobox', { name: 'Search for a location' }).click();
  const value = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(value).toBe('');
});
