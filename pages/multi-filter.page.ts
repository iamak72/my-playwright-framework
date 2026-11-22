
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  MultiFilterSelectors as S,
  FilterCategory,
  MatchCriteria,
} from '../locators/multi-filter.selectors';

export interface FilterRuleData {
  field: string;
  condition: string;
  value: string;
}

export interface MultiFilterFormData {
  name: string;
  description?: string;
  isPreset?: boolean;
  category: FilterCategory;
  matchCriteria: MatchCriteria;
  rules: FilterRuleData[];
}

export class MultiFilterPage extends BasePage {
  private readonly modulePath =
    process.env.PW_MULTI_FILTER_PATH || '/MultiFilter';

  constructor(page: Page) {
    super(page);
  }

  // ---------------------------------------------------------
  // Locator helpers
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
      `No visible element found. Selectors: ${selectors.join(', ')}`,
    );
  }

  private async getModal(): Promise<Locator> {
    for (const selector of S.modal.root) {
      const modal = this.page.locator(selector).last();

      if (await modal.isVisible().catch(() => false)) {
        return modal;
      }
    }

    throw new Error('Multi Filter modal is not visible.');
  }

  private async getTable(): Promise<Locator> {
    return this.firstVisible(S.listing.table);
  }

  private async getSearchInput(): Promise<Locator> {
    return this.firstVisible(S.listing.search);
  }

  private async getRuleRows(modal: Locator): Promise<Locator> {
    const container = await this.firstVisible(
      S.modal.rules.container,
      modal,
    );

    return container.locator(S.modal.rules.row.join(', '));
  }

  /**
   * Selects an option from either a native HTML select or a custom
   * dropdown rendered with role=option / visible text.
   */
  private async selectOption(
    control: Locator,
    option: string,
  ): Promise<void> {
    const tagName = await control.evaluate(element =>
      element.tagName.toLowerCase(),
    );

    if (tagName === 'select') {
      const byLabel = await control
        .selectOption({ label: option })
        .then(() => true)
        .catch(() => false);

      if (byLabel) return;

      await control.selectOption({ value: option });
      return;
    }

    await control.click();

    const roleOption = this.page
      .getByRole('option', { name: option, exact: true })
      .last();

    if (await roleOption.isVisible().catch(() => false)) {
      await roleOption.click();
      return;
    }

    const textOption = this.page
      .getByText(option, { exact: true })
      .last();

    await expect(textOption).toBeVisible();
    await textOption.click();
  }

  private async fillControl(
    control: Locator,
    value: string,
  ): Promise<void> {
    const tagName = await control.evaluate(element =>
      element.tagName.toLowerCase(),
    );

    if (tagName === 'select') {
      await this.selectOption(control, value);
      return;
    }

    const inputType = await control.getAttribute('type');

    if (inputType === 'checkbox') {
      const shouldBeChecked = value.toLowerCase() === 'true';

      if (shouldBeChecked) {
        await control.check();
      } else {
        await control.uncheck();
      }

      return;
    }

    await control.fill(value);
  }

  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------

  async gotoMultiFilter(): Promise<void> {
    await this.navigateToModule(this.modulePath);

    await expect(
      this.page.getByText(S.page.heading, { exact: true }).first(),
    ).toBeVisible();
  }

  async verifyMultiFilterPage(): Promise<void> {
    await expect(
      this.page.getByText(S.page.heading, { exact: true }).first(),
    ).toBeVisible();

    await this.getTable();
    await this.getSearchInput();
  }

  // ---------------------------------------------------------
  // Listing and metrics
  // ---------------------------------------------------------

  async verifyMetricCards(): Promise<void> {
    const selectors = [
      S.metrics.savedFilters,
      S.metrics.presets,
      S.metrics.rulesInUse,
      S.metrics.lastUpdated,
    ];

    for (const selector of selectors) {
      const locator = this.page.locator(selector);

      // Some dashboards may not render every metric for all roles.
      if (await locator.count()) {
        await expect(locator.first()).toBeVisible();
      }
    }
  }

  async selectListingTab(
    tab: 'All' | 'Presets' | 'Custom',
  ): Promise<void> {
    const tabName = {
      All: S.listing.tabs.all,
      Presets: S.listing.tabs.presets,
      Custom: S.listing.tabs.custom,
    }[tab];

    const tabLocator = this.page
      .getByRole('tab', { name: tabName, exact: true })
      .or(this.page.getByText(tabName, { exact: true }))
      .last();

    await expect(tabLocator).toBeVisible();
    await tabLocator.click();
  }

  async clickNewFilter(): Promise<void> {
    const button = await this.firstVisible(
      S.listing.newFilterButton,
    );

    await button.click();
    await this.getModal();
  }

  async getFilterRow(name: string): Promise<Locator> {
    const table = await this.getTable();
    const row = table
      .locator(S.listing.rows)
      .filter({ hasText: name })
      .first();

    await expect(
      row,
      `Filter row "${name}" should be visible.`,
    ).toBeVisible();

    return row;
  }

  async verifyFilterVisible(name: string): Promise<void> {
    await this.getFilterRow(name);
  }

  async verifyFilterNotVisible(name: string): Promise<void> {
    const table = await this.getTable();

    await expect(
      table.locator(S.listing.rows).filter({ hasText: name }),
    ).toHaveCount(0);
  }

  // ---------------------------------------------------------
  // Modal fields
  // ---------------------------------------------------------

  async fillFilterName(name: string): Promise<void> {
    if (!name.trim()) {
      throw new Error('Filter name is required.');
    }

    const modal = await this.getModal();
    const input = await this.firstVisible(S.modal.name, modal);

    await input.fill(name);
  }

  async fillDescription(description?: string): Promise<void> {
    if (description === undefined) return;

    const modal = await this.getModal();
    const input = await this.firstVisible(
      S.modal.description,
      modal,
    );

    await input.fill(description);
  }

  async setPreset(enabled: boolean): Promise<void> {
    const modal = await this.getModal();
    const preset = await this.firstVisible(S.modal.preset, modal);

    const tagName = await preset.evaluate(element =>
      element.tagName.toLowerCase(),
    );

    if (tagName === 'input') {
      const type = await preset.getAttribute('type');

      if (type === 'checkbox') {
        if (enabled) {
          await preset.check();
        } else {
          await preset.uncheck();
        }

        return;
      }
    }

    const role = await preset.getAttribute('role');

    if (role === 'switch') {
      const checked =
        (await preset.getAttribute('aria-checked')) === 'true';

      if (checked !== enabled) {
        await preset.click();
      }

      await expect(preset).toHaveAttribute(
        'aria-checked',
        String(enabled),
      );

      return;
    }

    throw new Error(
      'Preset control is neither a checkbox nor an accessible switch.',
    );
  }

  async selectCategory(category: FilterCategory): Promise<void> {
    const modal = await this.getModal();

    const tab = modal
      .getByRole('tab', { name: category, exact: true })
      .or(modal.getByText(category, { exact: true }))
      .last();

    await expect(tab).toBeVisible();
    await tab.click();
  }

  // ---------------------------------------------------------
  // Rule builder
  // ---------------------------------------------------------

  async selectMatchCriteria(
    criteria: MatchCriteria,
  ): Promise<void> {
    const modal = await this.getModal();
    const control = await this.firstVisible(
      S.modal.matchCriteria,
      modal,
    );

    await this.selectOption(control, criteria);
  }

  async addRule(): Promise<void> {
    const modal = await this.getModal();
    const button = await this.firstVisible(
      S.modal.rules.addRule,
      modal,
    );

    await button.click();
  }

  async addRuleGroup(): Promise<void> {
    const modal = await this.getModal();
    const button = await this.firstVisible(
      S.modal.rules.addGroup,
      modal,
    );

    await button.click();
  }

  async configureRule(
    rule: FilterRuleData,
    index = 0,
  ): Promise<void> {
    const modal = await this.getModal();
    const rows = await this.getRuleRows(modal);
    const row = rows.nth(index);

    await expect(row).toBeVisible();

    const field = await this.firstVisible(
      S.modal.rules.field,
      row,
    );

    const condition = await this.firstVisible(
      S.modal.rules.condition,
      row,
    );

    const value = await this.firstVisible(
      S.modal.rules.value,
      row,
    );

    await this.selectOption(field, rule.field);
    await this.selectOption(condition, rule.condition);
    await this.fillControl(value, rule.value);
  }

  async configureRules(rules: FilterRuleData[]): Promise<void> {
    if (!rules.length) {
      throw new Error(
        'At least one rule is required for this test flow.',
      );
    }

    const modal = await this.getModal();
    let rows = await this.getRuleRows(modal);

    for (let index = 0; index < rules.length; index++) {
      if (index > 0) {
        await this.addRule();
        rows = await this.getRuleRows(modal);

        await expect(rows).toHaveCount(index + 1);
      }

      await this.configureRule(rules[index], index);
    }
  }

  // ---------------------------------------------------------
  // SQL preview and test
  // ---------------------------------------------------------

  async previewSql(): Promise<void> {
    const modal = await this.getModal();
    const button = await this.firstVisible(
      S.modal.sqlPreview.previewButton,
      modal,
    );

    await button.click();
  }

  async testFilter(): Promise<void> {
    const modal = await this.getModal();
    const button = await this.firstVisible(
      S.modal.sqlPreview.testButton,
      modal,
    );

    await button.click();
  }

  // ---------------------------------------------------------
  // Save / Cancel / Close
  // ---------------------------------------------------------

  async saveFilter(): Promise<void> {
    const modal = await this.getModal();
    const button = await this.firstVisible(
      S.modal.save,
      modal,
    );

    await expect(button).toBeEnabled();
    await button.click();

    await expect(modal).toBeHidden({
      timeout: 15000,
    });
  }

  async cancelFilter(): Promise<void> {
    const modal = await this.getModal();
    const button = await this.firstVisible(
      S.modal.cancel,
      modal,
    );

    await button.click();
    await expect(modal).toBeHidden();
  }

  async closeFilterModal(): Promise<void> {
    const modal = await this.getModal();
    const button = await this.firstVisible(
      S.modal.close,
      modal,
    );

    await button.click();
    await expect(modal).toBeHidden();
  }

  async fillFilterForm(data: MultiFilterFormData): Promise<void> {
    await this.fillFilterName(data.name);
    await this.fillDescription(data.description);
    await this.selectCategory(data.category);
    await this.selectMatchCriteria(data.matchCriteria);

    if (data.isPreset !== undefined) {
      await this.setPreset(data.isPreset);
    }

    await this.configureRules(data.rules);
  }

  async createFilter(data: MultiFilterFormData): Promise<void> {
    await this.clickNewFilter();
    await this.fillFilterForm(data);
    await this.saveFilter();
  }

  // ---------------------------------------------------------
  // Search / Read
  // ---------------------------------------------------------

  async searchFilter(name: string): Promise<void> {
    const search = await this.getSearchInput();
    await search.fill(name);
  }

  async clearSearch(): Promise<void> {
    const search = await this.getSearchInput();
    await search.clear();
  }

  // ---------------------------------------------------------
  // Edit / Update
  // ---------------------------------------------------------

  async clickEditFilter(name: string): Promise<void> {
    const row = await this.getFilterRow(name);
    const button = await this.firstVisible(
      S.table.editButton,
      row,
    );

    await button.click();
    await this.getModal();
  }

  async updateFilter(
    currentName: string,
    updatedData: MultiFilterFormData,
  ): Promise<void> {
    await this.clickEditFilter(currentName);
    await this.fillFilterForm(updatedData);
    await this.saveFilter();
  }

  // ---------------------------------------------------------
  // Clone / Copy
  // ---------------------------------------------------------

  async clickCloneFilter(name: string): Promise<void> {
    const row = await this.getFilterRow(name);
    const button = await this.firstVisible(
      S.table.cloneButton,
      row,
    );

    await button.click();
  }

  /**
   * Supports the common clone flow where clicking Clone opens
   * the filter modal and allows the cloned filter to be renamed.
   */
  async cloneFilter(
    currentName: string,
    clonedName: string,
  ): Promise<void> {
    await this.clickCloneFilter(currentName);

    const modal = await this.getModal();
    const nameInput = await this.firstVisible(
      S.modal.name,
      modal,
    );

    await nameInput.fill(clonedName);
    await this.saveFilter();
  }

  // ---------------------------------------------------------
  // Delete
  // ---------------------------------------------------------

  async clickDeleteFilter(name: string): Promise<void> {
    const row = await this.getFilterRow(name);
    const button = await this.firstVisible(
      S.table.deleteButton,
      row,
    );

    await button.click();
  }

  async confirmDeleteFilter(name: string): Promise<void> {
    // Register the listener before clicking Delete to avoid
    // missing a native browser confirmation dialog.
    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 1500 })
      .catch(() => null);

    await this.clickDeleteFilter(name);

    const nativeDialog = await dialogPromise;

    if (nativeDialog) {
      await nativeDialog.accept();
      return;
    }

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

  async deleteFilter(name: string): Promise<void> {
    await this.confirmDeleteFilter(name);
  }
}
