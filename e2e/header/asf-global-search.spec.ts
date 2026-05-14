import { test, expect } from 'e2e/fixtures';

test('Header: ASF global search returns results', async ({ page }) => {
  await page.goto('/');

  const asfSearch = page.locator('#ASF_SEARCH');
  const searchResponse = page.waitForResponse((response) =>
    response.url().includes('searchv7.expertrec.com/v6/search/'),
  );

  await asfSearch.getByRole('searchbox', { name: 'search input' }).fill('hyp');
  await asfSearch.getByRole('searchbox', { name: 'search input' }).press('Enter');
  await searchResponse;

  await expect(page.locator('.er_search_results_count')).toContainText(/\d+/);
  await expect(page).toHaveURL(/#q=hyp/i);
});
