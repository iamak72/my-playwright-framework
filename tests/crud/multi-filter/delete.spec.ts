
import { test } from '../../../fixtures/test.fixture';
import { MultiFilterPage } from '../../../pages/multi-filter.page';
import { generateFilterData } from './multi-filter-test-data';

test.describe('Administration - Multi Filter CRUD: Delete', () => {
  test('should delete a filter from the listing', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);
    const filter = generateFilterData();

    await multiFilterPage.gotoMultiFilter();

    // Create a dedicated filter for this delete test.
    await multiFilterPage.createFilter(filter);

    await multiFilterPage.searchFilter(filter.name);
    await multiFilterPage.verifyFilterVisible(filter.name);

    await multiFilterPage.deleteFilter(filter.name);

    // Confirm that the deleted record is no longer listed.
    await multiFilterPage.verifyFilterNotVisible(filter.name);
  });
});
