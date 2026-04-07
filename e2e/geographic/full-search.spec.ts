import test, { expect } from '@playwright/test';
import { waitForASFAPIResponse } from 'e2e/helpers';

[
  { menuSelector: 'NISAR (Uncalibrated) NISAR', expected: 'NISAR' },
  { menuSelector: 'S1 Burst', expected: 'S1 Burst' },
  { menuSelector: 'OPERA-S1 Sentinel-1 RTC', expected: 'OPERA-S1' },
  { menuSelector: 'TROPO The Troposphere Zenith', expected: 'TROPO' },
  { menuSelector: 'ALOS-2', expected: 'ALOS-2' },
  { menuSelector: 'ALOS PALSAR', expected: 'ALOS PALSAR' },
  { menuSelector: 'ALOS AVNIR-2', expected: 'ALOS AVNIR' },
  { menuSelector: 'SIR-C', expected: 'SIR-C' },
  { menuSelector: 'ARIA S1 GUNW', expected: 'ARIA S1 GUNW' },
  { menuSelector: 'SMAP', expected: 'SMAP' },
  { menuSelector: 'UAVSAR', expected: 'UAVSAR' },
  { menuSelector: 'RADARSAT-1', expected: 'RADARSAT-1' },
  { menuSelector: 'ERS Primarily SAR imagery', expected: 'ERS' },
  { menuSelector: 'JERS-1', expected: 'JERS' },
  { menuSelector: 'AIRSAR', expected: 'AIRSAR' },
  { menuSelector: 'SEASAT', expected: 'SEASAT' },
].forEach(({ menuSelector, expected }) => {
  test(`Validate available dataset: ${expected}`, async ({ page }) => {
    await page.goto('/?maxResults=1');
    await page.getByRole('button', { name: 'Sentinel-' }).click();
    await page.getByRole('menuitem', { name: menuSelector }).click();
    await page
      .locator('#mat-button-toggle-8-button')
      .getByRole('button', { name: 'SEARCH' })
      .click();
    await waitForASFAPIResponse(page);
    await expect(page.locator('mat-card-header')).toContainText(expected);
  });
});
