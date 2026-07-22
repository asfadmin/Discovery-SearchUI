import { test, expect } from 'e2e/pages/auth.page';

test(
  'Profile: Set dark mode',
  { tag: ['@auth', '@visual'] },
  async ({ loggedInPage }) => {
    await loggedInPage
      .getByRole('button', { name: 'automatedtesting_fullaccess' })
      .click();
    await loggedInPage.getByRole('menuitem', { name: 'Preferences' }).click();

    const preferencesDialog = loggedInPage.getByRole('dialog', {
      name: /Preferences for automatedtesting_fullaccess/i,
    });
    await expect(loggedInPage).toHaveScreenshot();

    await preferencesDialog
      .getByRole('combobox', { name: 'Theme', exact: true })
      .click();
    await loggedInPage.getByRole('option', { name: 'Dark' }).click();

    await expect(loggedInPage.locator('body')).toHaveClass(/theme-dark/);

    await preferencesDialog.getByRole('button', { name: 'Done' }).click();
    await expect(loggedInPage).toHaveScreenshot();
  },
);
