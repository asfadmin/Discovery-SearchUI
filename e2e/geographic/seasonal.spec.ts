import { test, expect } from 'e2e/fixtures';

test('test', { tag: '@visual' }, async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('switch', { name: 'Seasonal Search' }).click();
  const seasonStart = page.locator('.dates > div').filter({
    hasText: 'Season Start Day',
  });
  const seasonEnd = page.locator('.dates > div').filter({
    hasText: 'Season End Day',
  });
  await seasonStart.getByRole('button', { name: '+1' }).click();
  await seasonStart.getByRole('button', { name: '+1' }).click();
  await seasonEnd.getByRole('button', { name: '-1' }).click();
  await seasonEnd.getByRole('button', { name: '-1' }).click();
  await seasonEnd.getByRole('button', { name: '-1' }).click();
  await expect(page.locator('app-info-bar')).toContainText('Season: 3 - 178');
  await expect(page).toHaveScreenshot();
});
