
import { test } from '../../../fixtures/test.fixture';
import { CategoriesPage } from '../../../pages/categories.page';
import {
  generateCategoryData,
} from './category-test-data';

test.describe('Administration - Categories CRUD: Read', () => {
  test('should search and display the correct category', async ({
    page,
  }) => {
    const categoriesPage = new CategoriesPage(page);
    const category = generateCategoryData();

    await categoriesPage.gotoCategories();

    // Create an isolated record for this read test.
    await categoriesPage.createCategory(category);

    await categoriesPage.searchCategory(category.name);
    await categoriesPage.verifyCategoryInTable(category);
  });

  test('should not display a category for an unmatched search', async ({
    page,
  }) => {
    const categoriesPage = new CategoriesPage(page);

    await categoriesPage.gotoCategories();

    await categoriesPage.searchCategory(
      `No_Category_${Date.now()}`,
    );

    await categoriesPage.verifyCategoryNotVisible(
      `No_Category_${Date.now()}`,
    );
  });

  test('should clear the category search filter', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const category = generateCategoryData();

    await categoriesPage.gotoCategories();
    await categoriesPage.createCategory(category);

    await categoriesPage.searchCategory(category.name);
    await categoriesPage.verifyCategoryVisible(category.name);

    await categoriesPage.clearSearch();

    // Search is cleared; the listing is available again.
    await categoriesPage.verifyCategoriesPage();
  });
});
