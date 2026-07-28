import { test, expect } from 'e2e/fixtures';
import { sentinel1Page } from 'e2e/helpers';

test('Multiple beam mode selections available', async ({ page }) => {
  await sentinel1Page(page);

  await page
    .getByRole('region', { name: 'Area of Interest Options' })
    .getByLabel('Area of Interest • WKT')
    .fill(
      'POLYGON((-37.4647 33.614,-16.283 31.0146,-19.7986 40.0775,-37.4647 33.614))',
    );
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('combobox', { name: 'Beam Mode' }).click();
  await page.getByRole('option', { name: 'EW' }).click();
  await page.getByRole('option', { name: 'S3' }).click();
  await page.getByRole('option', { name: 'S6' }).click();

  await expect(page.locator('app-info-bar')).toContainText(
    'Beam Modes: EW,S3,S6',
  );
});

test('Single beam mode selections available', async ({ page }) => {
  await sentinel1Page(page);

  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ARIA S1 GUNW NISAR-format' })
    .click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('combobox', { name: 'Beam Mode' }).click();
  await page.getByRole('option', { name: 'slc' }).click();
  await page.locator('.cdk-overlay-backdrop').click();
  await expect(page.locator('app-info-bar')).toContainText('Beam Modes: slc');
  await expect(page).toHaveScreenshot();
});
