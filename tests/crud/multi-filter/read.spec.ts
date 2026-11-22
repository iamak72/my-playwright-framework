
import { test } from '../../../fixtures/test.fixture';
import { MultiFilterPage } from '../../../pages/multi-filter.page';
import { generateFilterData } from './multi-filter-test-data';

test.describe('Administration - Multi Filter CRUD: Read', () => {
  test('should search and display the correct filter', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);
    const filter = generateFilterData();

    await multiFilterPage.gotoMultiFilter();

    // Create an isolated record for this read test.
    await multiFilterPage.createFilter(filter);

    await multiFilterPage.searchFilter(filter.name);
    await multiFilterPage.verifyFilterVisible(filter.name);
  });

  test('should not display a filter for an unmatched search', async ({
    page,
  }) => {
    const multiFilterPage = new MultiFilterPage(page);
    const searchTerm = `No_Filter_${Date.now()}`;

    await multiFilterPage.gotoMultiFilter();
    await multiFilterPage.searchFilter(searchTerm);

    await multiFilterPage.verifyFilterNotVisible(searchTerm);
  });

  test('should clear the filter search field', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);
    const filter = generateFilterData();

    await multiFilterPage.gotoMultiFilter();
    await multiFilterPage.createFilter(filter);

    await multiFilterPage.searchFilter(filter.name);
    await multiFilterPage.verifyFilterVisible(filter.name);

    await multiFilterPage.clearSearch();

    // Verify the listing remains available after clearing search.
    await multiFilterPage.verifyMultiFilterPage();
  });

  test('should filter the listing using Presets and Custom tabs', async ({
    page,
  }) => {
    const multiFilterPage = new MultiFilterPage(page);

    await multiFilterPage.gotoMultiFilter();

    await multiFilterPage.selectListingTab('Presets');
    await multiFilterPage.selectListingTab('Custom');
    await multiFilterPage.selectListingTab('All');
  });
});
