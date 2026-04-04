import test, { expect } from '@playwright/test';

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
    .locator('#mat-button-toggle-6-button')
    .getByRole('button', { name: 'SEARCH' })
    .click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const value = await page
    .getByLabel('Area of Interest Options')
    .getByLabel('Area of Interest • WKT')
    .inputValue();
  await expect(value).toContain(
    'POLYGON((-53.26 64.81,-48.1 60.33,-42.58 59.93,-40.94 63.63,-37.18 65.91,-31.29 67.17,-26.02 68.68,-21.97 70.57,-18.28 75.06,-17.05 77.04,-19.78 78.79,-10.72 81.55,-20.83 82.4,-25.44 83.13,-31.82 83.63,-43.95 83.23,-61.17 81.84,-66.58 80.39,-66.2 79.47,-74.09 78.37,-69.26 76.12,-61.08 76.1,-54.71 72.83,-55.04 71.55,-53.26 64.81))',
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
