
import {
  expect,
  Locator,
  Page,
} from '@playwright/test';

import { BasePage } from './base.page';
import { EpgLocators, EpgFilterTab } from '../locators/epg.locators';

export type EpgInitialState =
  | 'Published'
  | 'Expired'
  | 'Draft'
  | 'Hidden';

export interface EpgSourceData {
  url: string;
  prefix: string;
  initialState: EpgInitialState;
  languages?: string[];
}

export interface EpgSourceUpdate {
  prefix?: string;
  initialState?: EpgInitialState;
}

export class EpgPage extends BasePage {
  readonly locators: EpgLocators;

  private readonly epgPath = '/epg';

  constructor(page: Page) {
    super(page);

    this.locators = new EpgLocators(page);
  }

  /**
   * Navigate to the EPG Sources page.
   */
  async gotoEpgPage(): Promise<void> {
    await this.navigateTo(this.epgPath);

    await this.waitForElement(
      this.locators.searchInput
    );

    await this.waitForElement(
      this.locators.addSourceButton
    );
  }

  /**
   * Open the Add Source sidebar.
   */
  async clickAddSource(): Promise<void> {
    await this.locators.addSourceButton.click();

    await this.waitForElement(
      this.locators.prefixInput
    );
  }

  /**
   * Switch to URL source mode.
   */
  async selectUrlTab(): Promise<void> {
    if (await this.locators.urlTab.isVisible()) {
      await this.locators.urlTab.click();
    }

    await this.waitForElement(
      this.locators.xmltvUrlInput
    );
  }

  /**
   * Switch to Upload source mode.
   */
  async selectUploadTab(): Promise<void> {
    await expect(this.locators.uploadTab).toBeVisible();

    await this.locators.uploadTab.click();
  }

  /**
   * Fill the EPG source form.
   */
  async fillSourceForm(
    source: EpgSourceData
  ): Promise<void> {
    await this.selectUrlTab();

    await this.locators.xmltvUrlInput.fill(
      source.url
    );

    await this.locators.prefixInput.fill(
      source.prefix
    );

    const stateField = this.locators.initialStateSelect;

    if (await stateField.count() > 0) {
      const tagName = await stateField.evaluate(
        element => element.tagName.toLowerCase()
      );

      if (tagName === 'select') {
        await stateField.selectOption({
          label: source.initialState,
        });
      } else {
        await stateField.click();

        await this.page.getByRole('option', {
          name: source.initialState,
          exact: true,
        }).click();
      }
    } else {
      // Support custom dropdowns when no native select exists.
      const stateDropdown = this.page.locator(
        '[name="InitialState"], [data-testid="initial-state"]'
      ).first();

      await stateDropdown.click();

      await this.page.getByText(
        source.initialState,
        { exact: true }
      ).last().click();
    }

    // Select languages only when explicitly provided.
    if (source.languages?.length) {
      await this.selectLanguages(source.languages);
    }
  }

  /**
   * Select one or more languages.
   */
  async selectLanguages(
    languages: string[]
  ): Promise<void> {
    for (const language of languages) {
      const checkbox = this.page.getByRole('checkbox', {
        name: new RegExp(`^${language}$`, 'i'),
      });

      if (await checkbox.count() > 0) {
        if (!(await checkbox.isChecked())) {
          await checkbox.check();
        }
      } else {
        const languageLabel = this.page.getByText(
          language,
          { exact: true }
        ).last();

        await languageLabel.click();
      }
    }
  }

  /**
   * Submit the Add Source form.
   */
  async submitSource(): Promise<void> {
    await expect(
      this.locators.submitSourceButton
    ).toBeVisible();

    await this.locators.submitSourceButton.click();

    await expect(
      this.locators.prefixInput
    ).toBeHidden();
  }

  /**
   * Search for an EPG source using its prefix.
   */
  async searchSource(prefix: string): Promise<void> {
    await this.locators.searchInput.fill(prefix);
  }

  /**
   * Check whether a source exists in the grid.
   */
  async isSourcePresent(prefix: string): Promise<boolean> {
    return (
      await this.locators.rowByPrefix(prefix).count()
    ) > 0;
  }

  /**
   * Select a grid filter tab.
   */
  async selectFilterTab(
    tab: EpgFilterTab
  ): Promise<void> {
    const filter = this.locators.filterTab(tab);

    await expect(filter).toBeVisible();

    await filter.click();
  }

  /**
   * Verify source metadata in the grid.
   */
  async verifySourceDetails(
    source: EpgSourceData
  ): Promise<void> {
    const row = this.locators.rowByPrefix(
      source.prefix
    );

    await expect(row).toBeVisible();

    await expect(row).toContainText(source.prefix);
    await expect(row).toContainText(source.url);
    await expect(row).toContainText(source.initialState);
  }

  /**
   * Execute Check Now for a source.
   */
  async checkNowSource(prefix: string): Promise<void> {
    const checkNowButton =
      this.locators.rowAction(prefix, 'Check now');

    await expect(checkNowButton).toBeVisible();

    await checkNowButton.click();
  }

  /**
   * Open a source for viewing.
   */
  async viewSource(prefix: string): Promise<void> {
    const viewButton =
      this.locators.rowAction(prefix, 'View');

    await expect(viewButton).toBeVisible();

    await viewButton.click();
  }

  /**
   * Edit the source prefix.
   */
  async editSourcePrefix(
    currentPrefix: string,
    updatedPrefix: string
  ): Promise<void> {
    const editButton =
      this.locators.rowAction(currentPrefix, 'Edit prefix');

    await expect(editButton).toBeVisible();

    await editButton.click();

    const prefixField = this.page.locator(
      'input[name="Prefix"], input[name="prefix"]'
    ).last();

    await expect(prefixField).toBeVisible();

    await prefixField.fill(updatedPrefix);

    const saveButton =
      this.locators.getEditorSaveButton();

    await expect(saveButton).toBeVisible();

    await saveButton.click();

    await expect(
      this.locators.rowByPrefix(updatedPrefix)
    ).toBeVisible();
  }

  /**
   * Edit the source initial state.
   */
  async editSourceState(
    prefix: string,
    updatedState: EpgInitialState
  ): Promise<void> {
    const editButton =
      this.locators.rowAction(prefix, 'Edit state');

    await expect(editButton).toBeVisible();

    await editButton.click();

    const stateField = this.page.locator(
      'select[name="InitialState"], ' +
      'select[name="initialState"], ' +
      'select[name="State"]'
    ).last();

    await expect(stateField).toBeVisible();

    await stateField.selectOption({
      label: updatedState,
    });

    const saveButton =
      this.locators.getEditorSaveButton();

    await expect(saveButton).toBeVisible();

    await saveButton.click();

    await expect(
      this.locators.rowByPrefix(prefix)
    ).toContainText(updatedState);
  }

  /**
   * Update prefix and/or state.
   */
  async editSource(
    currentPrefix: string,
    updates: EpgSourceUpdate
  ): Promise<void> {
    if (updates.prefix) {
      await this.editSourcePrefix(
        currentPrefix,
        updates.prefix
      );
    }

    if (updates.initialState) {
      const prefixToUse =
        updates.prefix ?? currentPrefix;

      await this.editSourceState(
        prefixToUse,
        updates.initialState
      );
    }
  }

  /**
   * Remove an EPG source.
   */
  async deleteSource(prefix: string): Promise<void> {
    const row = this.locators.rowByPrefix(prefix);

    const removeButton =
      this.locators.rowAction(prefix, 'Remove');

    await expect(row).toBeVisible();
    await expect(removeButton).toBeVisible();

    // Support native JavaScript confirmation.
    const dialogHandler = async (
      dialog: import('@playwright/test').Dialog
    ): Promise<void> => {
      await dialog.accept();
    };

    this.page.on('dialog', dialogHandler);

    try {
      await removeButton.click();
    } finally {
      this.page.off('dialog', dialogHandler);
    }

    // Support application confirmation modal.
    const confirmation =
      this.locators.getConfirmationButton();

    if (await confirmation.count() > 0) {
      if (await confirmation.isVisible()) {
        await confirmation.click();
      }
    }

    await expect(row).toHaveCount(0);
  }

  /**
   * Verify source removal.
   */
  async verifySourceDeleted(
    prefix: string
  ): Promise<void> {
    await expect(
      this.locators.rowByPrefix(prefix)
    ).toHaveCount(0);
  }

  /**
   * Return a source row for additional assertions.
   */
  getSourceRow(prefix: string): Locator {
    return this.locators.rowByPrefix(prefix);
  }
}
