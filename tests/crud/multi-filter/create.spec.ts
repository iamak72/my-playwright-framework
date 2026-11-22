
import { test } from '../../../fixtures/test.fixture';
import { MultiFilterPage } from '../../../pages/multi-filter.page';
import { generateFilterData } from './multi-filter-test-data';

test.describe('Administration - Multi Filter CRUD: Create', () => {
  test('should create a custom filter with a rule', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);

    const filter = generateFilterData({
      isPreset: false,
      category: 'Account group',
    });

    await multiFilterPage.gotoMultiFilter();

    await multiFilterPage.createFilter(filter);

    // Search and verify the newly created filter.
    await multiFilterPage.searchFilter(filter.name);
    await multiFilterPage.verifyFilterVisible(filter.name);
  });

  test('should create a preset filter', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);

    const filter = generateFilterData({
      isPreset: true,
      category: 'Content',
    });

    await multiFilterPage.gotoMultiFilter();

    await multiFilterPage.createFilter(filter);

    await multiFilterPage.searchFilter(filter.name);
    await multiFilterPage.verifyFilterVisible(filter.name);
  });
});
