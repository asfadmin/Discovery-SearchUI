import { test, expect } from 'e2e/fixtures';

test.use({ viewport: { width: 1600, height: 1200 } });

test('Click on displacement map', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();
  await page.mouse.move(800, 600);
  await page.mouse.down();
  await page.mouse.up();
  await expect(page.getByText('Frame: 09167')).toBeVisible();
});
