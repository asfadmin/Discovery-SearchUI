import { test, expect } from 'e2e/fixtures';

test(
  'Map: Overview Map toggle shows overview map',
  { tag: '@auth' },
  async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'layer selector' }).click();
    await expect(page).toHaveScreenshot();

    await page.getByRole('menuitem', { name: 'Overview Map' }).click();

    await expect(page.locator('.ol-overviewmap')).toBeVisible();
  },
);

test(
  'Map: Gridlines Overlay toggle updates checkbox state',
  { tag: '@auth' },
  async ({ page }) => {
    await page.goto('/');

    const layerButton = page.getByRole('button', { name: 'layer selector' });
    const gridlinesItem = page.getByRole('menuitem', {
      name: 'Gridlines Overlay',
    });

    await layerButton.click();
    await gridlinesItem.click();
    await expect(page).toHaveScreenshot();

    await layerButton.click();
    await expect(gridlinesItem.locator('input[type="checkbox"]')).toBeChecked();
  },
);

test(
  'Map: Coherence Layer activates when a month range is selected',
  { tag: '@auth' },
  async ({ page }) => {
    await page.goto('/');

    const layerButton = page.getByRole('button', { name: 'layer selector' });
    const coherenceItem = page.getByRole('menuitem', {
      name: 'Coherence Layer',
    });

    await layerButton.click();
    await coherenceItem.click();
    await expect(page).toHaveScreenshot();

    await page.getByRole('menuitem', { name: 'Mar, Apr, May' }).click();

    await layerButton.click();
    await expect(coherenceItem.locator('input[type="checkbox"]')).toBeChecked();
  },
);

test('Map: switch base layer between Satellite and Street', async ({
  page,
}) => {
  await page.goto('/');

  const layerButton = page.getByRole('button', { name: 'layer selector' });
  const layerIcon = layerButton.locator('mat-icon.control-icon');

  await layerButton.click();
  await page.getByRole('menuitem', { name: 'Street Layer' }).click();
  await expect(layerIcon).toHaveText('directions_car');

  await layerButton.click();
  await page.getByRole('menuitem', { name: 'Satellite Layer' }).click();
  await expect(layerIcon).toHaveText('terrain');
});
