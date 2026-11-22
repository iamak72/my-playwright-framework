
import { test } from '../../../fixtures/test.fixture';
import { CategoriesPage } from '../../../pages/categories.page';
import {
  generateCategoryData,
} from './category-test-data';

test.describe('Administration - Categories CRUD: Delete', () => {
  test('should delete a category from the listing', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const category = generateCategoryData();

    await categoriesPage.gotoCategories();

    // Create an isolated record for deletion.
    await categoriesPage.createCategory(category);

    await categoriesPage.searchCategory(category.name);
    await categoriesPage.verifyCategoryVisible(category.name);

    // Delete and verify removal.
    await categoriesPage.deleteCategory(category.name);

    await categoriesPage.verifyCategoryNotVisible(category.name);
  });
});
