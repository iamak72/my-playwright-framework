
import { test } from '../../../fixtures/test.fixture';
import { CategoriesPage } from '../../../pages/categories.page';
import {
  generateCategoryData,
} from './category-test-data';

test.describe('Administration - Categories CRUD: Create', () => {
  test('should create a category with name, scope and order', async ({
    page,
  }) => {
    const categoriesPage = new CategoriesPage(page);
    const category = generateCategoryData({
      scope: 'IPTV',
    });

    await categoriesPage.gotoCategories();

    await categoriesPage.createCategory(category);

    // Verify the newly created record in the listing.
    await categoriesPage.searchCategory(category.name);
    await categoriesPage.verifyCategoryInTable(category);
  });

  test('should create a category without optional order', async ({
    page,
  }) => {
    const categoriesPage = new CategoriesPage(page);

    const category = generateCategoryData({
      scope: 'VOD',
      order: undefined,
    });

    await categoriesPage.gotoCategories();
    await categoriesPage.createCategory(category);

    await categoriesPage.searchCategory(category.name);
    await categoriesPage.verifyCategoryVisible(category.name);
  });
});
