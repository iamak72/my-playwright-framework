
import { expect } from '@playwright/test';
import { test } from '../../../fixtures/test.fixture';
import { CategoriesPage } from '../../../pages/categories.page';

test.describe('Administration - Categories Navigation', () => {
  test('should navigate to Categories module', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);

    await categoriesPage.gotoCategories();

    await expect(page).toHaveURL(/Categories/i);
    await categoriesPage.verifyCategoriesPage();
  });

  test('should open and close Add Category modal', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);

    await categoriesPage.gotoCategories();
    await categoriesPage.clickAddCategory();
    await categoriesPage.cancelCategory();
  });
});
