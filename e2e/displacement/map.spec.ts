import { test, expect } from 'e2e/fixtures';

test('Click on displacement map', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();
  await page.mouse.move(800, 600);
  await page.mouse.down();
  await page.mouse.up();
  await expect(page.locator('#mat-mdc-checkbox-7')).toContainText(
    'Frame: 09167',
  );
});
