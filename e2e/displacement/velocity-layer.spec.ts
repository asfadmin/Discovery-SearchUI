import { test, expect } from 'e2e/fixtures';

test('Displacement: velocity layer is enabled by default and shows legend and opacity slider', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();

  const displacementLayers = page.locator('app-displacement-layers');
  const velocityCheckbox = displacementLayers.getByRole('checkbox', {
    name: /Velocity 2016-2024/i,
  });

  await expect(velocityCheckbox).toBeChecked();
  await expect(displacementLayers.locator('app-map-legend')).toBeVisible();
  await expect(
    displacementLayers.locator('mat-slider input[matSliderThumb]'),
  ).toBeVisible();
});
