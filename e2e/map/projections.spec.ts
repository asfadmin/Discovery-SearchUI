import { test, expect } from 'e2e/fixtures';

[
  {
    name: 'Arctic',
    ariaLabel: 'Arctic map projection',
    urlPattern: /view=arctic/i,
  },
  {
    name: 'Antarctic',
    ariaLabel: 'Antarctic map projection',
    urlPattern: /view=antarctic/i,
  },
].forEach(({ name, ariaLabel, urlPattern }) => {
  test(`Map: switch view to ${name} projection`, async ({ page }) => {
    const button = page
      .locator('app-view-selector')
      .getByRole('button', { name: ariaLabel, exact: true });

    await button.click();

    await expect(button).toHaveClass(/selected/);
    await expect(page).toHaveURL(urlPattern);
  });
});

test('Map: switch view back to Equatorial projection from Arctic', async ({
  page,
}) => {
  const viewSelector = page.locator('app-view-selector');

  await viewSelector
    .getByRole('button', { name: 'Arctic map projection', exact: true })
    .click();

  const equatorialButton = viewSelector.getByRole('button', {
    name: 'Equatorial map projection',
    exact: true,
  });

  await equatorialButton.click();

  await expect(equatorialButton).toHaveClass(/selected/);
  await expect(page).not.toHaveURL(/view=arctic/i);
});
