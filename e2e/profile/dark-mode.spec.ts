import { test, expect } from 'e2e/fixtures';
import { accessibilityScan, loggedInSentinel1Page } from 'e2e/helpers';

test(
  'Profile: Set dark mode',
  { tag: ['@auth', '@visual', '@a11y'] },
  async ({ page }) => {
    const loggedInPage = await loggedInSentinel1Page(page);

    await loggedInPage
      .getByRole('button', { name: 'automatedtesting_fullaccess' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Preferences' }).click();

    const preferencesDialog = loggedInPage.getByRole('dialog', {
      name: /Preferences for automatedtesting_fullaccess/i,
    });
    await expect(loggedInPage).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();

    await preferencesDialog
      .getByRole('combobox', { name: 'Theme', exact: true })
      .click();
    await loggedInPage.getByRole('option', { name: 'Dark' }).click();

    await expect(loggedInPage.locator('body')).toHaveClass(/theme-dark/);

    await preferencesDialog.getByRole('button', { name: 'Done' }).click();
    await expect(loggedInPage).toHaveScreenshot();
    expect(await accessibilityScan(page)).toMatchSnapshot();
  },
);
