
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  CategorySelectors as S,
  CategoryScope,
} from '../locators/category.selectors';

export interface CategoryFormData {
  name: string;
  scope: CategoryScope;
  order?: number;
}

export class CategoriesPage extends BasePage {
  private readonly categoryPath =
    process.env.PW_CATEGORIES_PATH || '/Categories';

  constructor(page: Page) {
    super(page);
  }

  // ---------------------------------------------------------
  // Common locator helpers
  // ---------------------------------------------------------

  private async firstVisible(
    selectors: readonly string[],
    parent: Locator | Page = this.page,
  ): Promise<Locator> {
    for (const selector of selectors) {
      const locator = parent.locator(selector).first();

      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    throw new Error(
      `No visible element found for selectors: ${selectors.join(', ')}`,
    );
  }

  private async getModal(): Promise<Locator> {
    for (const selector of S.modal.root) {
      const locator = this.page.locator(selector).last();

      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    throw new Error('Category modal is not visible.');
  }

  private async getTable(): Promise<Locator> {
    return this.firstVisible(S.listing.table);
  }

  private async getSearchInput(): Promise<Locator> {
    return this.firstVisible(S.listing.search);
  }

  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------

  async gotoCategories(): Promise<void> {
    await this.navigateToModule(this.categoryPath);

    await expect(
      this.page.getByText(S.page.heading, { exact: true }).first(),
    ).toBeVisible();
  }

  // ---------------------------------------------------------
  // Listing and overview
  // ---------------------------------------------------------

  async verifyCategoriesPage(): Promise<void> {
    await expect(
      this.page.getByText(S.page.heading, { exact: true }).first(),
    ).toBeVisible();

    await this.getTable();
  }

  async verifyMetricCards(): Promise<void> {
    const metricSelectors = [
      S.metrics.total,
      S.metrics.iptv,
      S.metrics.vod,
      S.metrics.both,
    ];

    for (const selector of metricSelectors) {
      const metric = this.page.locator(selector);

      if (await metric.count()) {
        await expect(metric.first()).toBeVisible();
      }
    }
  }

  async clickAddCategory(): Promise<void> {
    const addButton = await this.firstVisible(
      S.listing.addButton,
    );

    await addButton.click();
    await this.getModal();
  }

  async getCategoryRow(name: string): Promise<Locator> {
    const table = await this.getTable();
    const rows = table.locator(S.listing.rows);

    const row = rows.filter({ hasText: name }).first();

    await expect(
      row,
      `Category row "${name}" should exist.`,
    ).toBeVisible();

    return row;
  }

  async verifyCategoryInTable(
    data: CategoryFormData,
  ): Promise<void> {
    const row = await this.getCategoryRow(data.name);

    await expect(row).toContainText(data.name);
    await expect(
      row.locator(S.table.scopeCell),
    ).toContainText(data.scope);

    if (data.order !== undefined) {
      await expect(
        row.locator(S.table.orderCell),
      ).toContainText(String(data.order));
    }
  }

  // ---------------------------------------------------------
  // Modal form
  // ---------------------------------------------------------

  async fillCategoryName(name: string): Promise<void> {
    const modal = await this.getModal();
    const input = await this.firstVisible(S.modal.name, modal);

    await input.fill(name);
  }

  async selectScope(scope: CategoryScope): Promise<void> {
    const modal = await this.getModal();
    const dropdown = await this.firstVisible(S.modal.scope, modal);

    const tagName = await dropdown.evaluate(
      element => element.tagName.toLowerCase(),
    );

    if (tagName === 'select') {
      await dropdown.selectOption({
        label: scope,
      });

      return;
    }

    await dropdown.click();

    const option = this.page
      .getByRole('option', { name: scope, exact: true })
      .last();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }

    const textOption = this.page
      .getByText(scope, { exact: true })
      .last();

    await expect(textOption).toBeVisible();
    await textOption.click();
  }

  async fillOrder(order?: number): Promise<void> {
    if (order === undefined) {
      return;
    }

    if (!Number.isInteger(order) || order < 0) {
      throw new Error(
        `Invalid category order "${order}". Order must be a non-negative integer.`,
      );
    }

    const modal = await this.getModal();
    const input = await this.firstVisible(S.modal.order, modal);

    await input.fill(String(order));
  }

  async fillCategoryForm(data: CategoryFormData): Promise<void> {
    if (!data.name.trim()) {
      throw new Error('Category name is required.');
    }

    await this.fillCategoryName(data.name);
    await this.selectScope(data.scope);
    await this.fillOrder(data.order);
  }

  async saveCategory(): Promise<void> {
    const modal = await this.getModal();
    const saveButton = await this.firstVisible(
      S.modal.save,
      modal,
    );

    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(modal).toBeHidden({
      timeout: 10000,
    });
  }

  async cancelCategory(): Promise<void> {
    const modal = await this.getModal();
    const cancelButton = await this.firstVisible(
      S.modal.cancel,
      modal,
    );

    await cancelButton.click();

    await expect(modal).toBeHidden();
  }

  async closeCategoryModal(): Promise<void> {
    const modal = await this.getModal();
    const closeButton = await this.firstVisible(
      S.modal.close,
      modal,
    );

    await closeButton.click();

    await expect(modal).toBeHidden();
  }

  async createCategory(data: CategoryFormData): Promise<void> {
    await this.clickAddCategory();
    await this.fillCategoryForm(data);
    await this.saveCategory();
  }

  // ---------------------------------------------------------
  // Search / Read
  // ---------------------------------------------------------

  async searchCategory(name: string): Promise<void> {
    const search = await this.getSearchInput();

    await search.fill(name);
  }

  async clearSearch(): Promise<void> {
    const search = await this.getSearchInput();

    await search.clear();
  }

  async verifyCategoryVisible(name: string): Promise<void> {
    const row = await this.getCategoryRow(name);

    await expect(row).toBeVisible();
  }

  async verifyCategoryNotVisible(name: string): Promise<void> {
    const table = await this.getTable();

    await expect(
      table.locator(S.listing.rows).filter({ hasText: name }),
    ).toHaveCount(0);
  }

  // ---------------------------------------------------------
  // Update / Edit
  // ---------------------------------------------------------

  async clickEditCategory(name: string): Promise<void> {
    const row = await this.getCategoryRow(name);
    const editButton = await this.firstVisible(
      S.table.editButton,
      row,
    );

    await editButton.click();
    await this.getModal();
  }

  async updateCategory(
    currentName: string,
    updatedData: CategoryFormData,
  ): Promise<void> {
    await this.clickEditCategory(currentName);
    await this.fillCategoryForm(updatedData);
    await this.saveCategory();
  }

  // ---------------------------------------------------------
  // Delete
  // ---------------------------------------------------------

  async clickDeleteCategory(name: string): Promise<void> {
    const row = await this.getCategoryRow(name);
    const deleteButton = await this.firstVisible(
      S.table.deleteButton,
      row,
    );

    await deleteButton.click();
  }

  async confirmDeleteCategory(name: string): Promise<void> {
    // Some OPTIX screens use a native browser confirmation dialog.
    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 1500 })
      .catch(() => null);

    await this.clickDeleteCategory(name);

    const dialog = await dialogPromise;

    if (dialog) {
      await dialog.accept();
      return;
    }

    // Other screens use an in-page confirmation modal.
    const confirmation = await this.firstVisible(
      S.confirmation.dialog,
    );

    const confirmButton = await this.firstVisible(
      S.confirmation.confirm,
      confirmation,
    );

    await confirmButton.click();

    await expect(confirmation).toBeHidden({
      timeout: 10000,
    });
  }

  async deleteCategory(name: string): Promise<void> {
    await this.confirmDeleteCategory(name);
  }
}
