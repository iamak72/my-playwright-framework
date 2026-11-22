
import { test } from '../../../fixtures/test.fixture';
import { MultiFilterPage } from '../../../pages/multi-filter.page';
import {
  generateFilterData,
  generateFilterName,
} from './multi-filter-test-data';

test.describe('Administration - Multi Filter CRUD: Update', () => {
  test('should update filter name and rule configuration', async ({
    page,
  }) => {
    const multiFilterPage = new MultiFilterPage(page);

    const originalFilter = generateFilterData({
      isPreset: false,
      category: 'Account group',
    });

    const updatedFilter = {
      ...originalFilter,
      name: generateFilterName(),
      description: 'Updated filter description',
      category: 'Content' as const,
      matchCriteria: 'Any rules' as const,
      rules: [
        {
          field: 'Account status',
          condition: 'is',
          value: 'Active',
        },
      ],
    };

    await multiFilterPage.gotoMultiFilter();

    // Create a dedicated record before updating it.
    await multiFilterPage.createFilter(originalFilter);

    await multiFilterPage.searchFilter(originalFilter.name);
    await multiFilterPage.verifyFilterVisible(originalFilter.name);

    await multiFilterPage.updateFilter(
      originalFilter.name,
      updatedFilter,
    );

    // Verify the updated record.
    await multiFilterPage.searchFilter(updatedFilter.name);
    await multiFilterPage.verifyFilterVisible(updatedFilter.name);

    // The old name should no longer be present.
    await multiFilterPage.searchFilter(originalFilter.name);
    await multiFilterPage.verifyFilterNotVisible(originalFilter.name);
  });
});
