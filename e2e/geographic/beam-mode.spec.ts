import { test, expect } from '@playwright/test';
test('Multiple beam mode selections available', async ({ page }) => {
  await page.goto('');
  await page
    .locator('#mat-mdc-form-field-label-14')
    .getByText('Area of Interest • WKT')
    .click();
  await page
    .locator('#mat-input-9')
    .fill(
      'POLYGON((-37.4647 33.614,-16.283 31.0146,-19.7986 40.0775,-37.4647 33.614))',
    );
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Beam Mode$/ })
    .nth(2)
    .click();
  await page
    .getByRole('option', { name: 'EW' })
    .locator('mat-pseudo-checkbox')
    .click();
  await page
    .getByRole('option', { name: 'S3' })
    .locator('mat-pseudo-checkbox')
    .click();
  await page
    .getByRole('option', { name: 'S6' })
    .locator('mat-pseudo-checkbox')
    .click();

  await expect(page.locator('app-info-bar')).toContainText(
    'Beam Modes: EW,S3,S6',
  );
});

test('Single beam mode selections available', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sentinel-' }).click();
  await page
    .getByRole('menuitem', { name: 'ARIA S1 GUNW NISAR-format' })
    .click();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.locator('#mat-select-value-2').click();
  await page.getByRole('option', { name: 'slc' }).click();
  await page.locator('.cdk-overlay-backdrop').click();
  await expect(page.locator('app-info-bar')).toContainText('Beam Modes: slc');
});
