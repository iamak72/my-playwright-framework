
import { test } from '../../../fixtures/test.fixture';
import { CategoriesPage } from '../../../pages/categories.page';
import {
  generateCategoryData,
  generateUpdatedCategoryData,
} from './category-test-data';

test.describe('Administration - Categories CRUD: Update', () => {
  test('should update category name, scope and order', async ({
    page,
  }) => {
    const categoriesPage = new CategoriesPage(page);

    const originalCategory = generateCategoryData({
      scope: 'IPTV',
    });

    const updatedCategory = generateUpdatedCategoryData({
      scope: 'VOD',
    });

    await categoriesPage.gotoCategories();

    // Create a record that this test can safely modify.
    await categoriesPage.createCategory(originalCategory);

    await categoriesPage.searchCategory(originalCategory.name);
    await categoriesPage.verifyCategoryVisible(originalCategory.name);

    // Update the record using its row edit action.
    await categoriesPage.updateCategory(
      originalCategory.name,
      updatedCategory,
    );

    // Verify updated values in the listing.
    await categoriesPage.searchCategory(updatedCategory.name);
    await categoriesPage.verifyCategoryInTable(updatedCategory);

    // Verify that the previous name is no longer listed.
    await categoriesPage.searchCategory(originalCategory.name);
    await categoriesPage.verifyCategoryNotVisible(
      originalCategory.name,
    );
  });
});
