import { test, expect } from 'e2e/fixtures';

test('Displacement: flight direction toggles between ascending and descending', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Geographic Search' }).click();
  await page
    .getByRole('menuitem', { name: 'Displacement Displacement' })
    .click();

  const flightDirectionToggle = page.locator(
    'app-timeseries-chart-flight-direction-toggle',
  );
  const flightDirectionButton = flightDirectionToggle.getByRole('button', {
    name: /Ascending/i,
  });

  await flightDirectionButton.click();

  const descendingMenuItem = page.getByRole('menuitem', {
    name: 'Descending',
    exact: true,
  });
  await descendingMenuItem.click();

  const descendingButton = flightDirectionToggle.getByRole('button', {
    name: /Descending/i,
  });

  await descendingButton.click();

  const ascendingMenuItem = page.getByRole('menuitem', {
    name: 'Ascending',
    exact: true,
  });
  await ascendingMenuItem.click();
  await expect(
    flightDirectionToggle.getByRole('button', { name: /Ascending/i }),
  ).toBeVisible();
});
