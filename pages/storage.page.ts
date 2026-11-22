
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { StorageSelectors as S } from '../locators/storage.selectors';

export type StorageKind =
  | 'Local or network folder'
  | 'FTP';

export type StorageUse =
  | 'Source files'
  | 'Stream output';

export type RecordingOption =
  | 'Not allowed'
  | 'Stalker DVR';

export interface StorageFormData {
  title: string;
  kind: StorageKind;
  folderPath: string;
  active: boolean;
  useFor: StorageUse[];
  playbackUrlBase?: string;
  maximumUsers: number;
  recording: RecordingOption;
}

export class StoragePage extends BasePage {
  private readonly modulePath =
    process.env.PW_STORAGE_PATH || '/Addons/Storage';

  constructor(page: Page) {
    super(page);
  }

  // ---------------- Navigation ----------------

  async gotoStorage(): Promise<void> {
    await this.navigateToModule(this.modulePath);
    await this.verifyStoragePage();
  }

  async verifyStoragePage(): Promise<void> {
    await expect(
      this.page.locator(S.page.heading).first()
    ).toBeVisible();
  }

  // ---------------- Locator helpers ----------------

  private async firstVisible(
    selectors: string[],
    parent: Page | Locator = this.page
  ): Promise<Locator> {
    for (const selector of selectors) {
      const locator = parent.locator(selector).first();

      if (await locator.count() && await locator.isVisible()) {
        return locator;
      }
    }

    throw new Error(
      `No visible element found for selectors: ${selectors.join(', ')}`
    );
  }

  private async getModal(): Promise<Locator> {
    return this.firstVisible([S.modal.root]);
  }

  private async getRow(title: string): Promise<Locator> {
    const row = this.page
      .locator(S.table.rows)
      .filter({ hasText: title })
      .first();

    await expect(
      row,
      `Storage row "${title}" should exist`
    ).toBeVisible();

    return row;
  }

  private async fillInput(
    parent: Locator,
    selector: string,
    value: string
  ): Promise<void> {
    const input = parent.locator(selector).first();

    await expect(input).toBeVisible();
    await input.fill(value);
  }

  // ---------------- Listing ----------------

  async clickAddStorage(): Promise<void> {
    await this.page.locator(S.page.addButton).first().click();
    await this.getModal();
  }

  async searchStorage(title: string): Promise<void> {
    const search = this.page.locator(S.page.search).first();

    await expect(search).toBeVisible();
    await search.fill(title);
  }

  async clearSearch(): Promise<void> {
    const search = this.page.locator(S.page.search).first();

    if (await search.count()) {
      await search.clear();
    }
  }

  async verifyStorageVisible(title: string): Promise<void> {
    await expect(await this.getRow(title)).toBeVisible();
  }

  async verifyStorageNotVisible(title: string): Promise<void> {
    const row = this.page
      .locator(S.table.rows)
      .filter({ hasText: title });

    await expect(row).toHaveCount(0);
  }

  async verifyRowContains(
    title: string,
    expectedText: string
  ): Promise<void> {
    const row = await this.getRow(title);
    await expect(row).toContainText(expectedText);
  }

  async getStorageRow(title: string): Promise<Locator> {
    return this.getRow(title);
  }

  // ---------------- Form controls ----------------

  private async selectDropdown(
    parent: Locator,
    selector: string,
    value: string
  ): Promise<void> {
    const dropdown = parent.locator(selector).first();

    await expect(dropdown).toBeVisible();

    const tagName = await dropdown.evaluate(
      element => element.tagName.toLowerCase()
    );

    if (tagName === 'select') {
      await dropdown.selectOption({ label: value });
      return;
    }

    await dropdown.click();

    const option = this.page
      .getByRole('option', { name: value, exact: true })
      .or(this.page.getByText(value, { exact: true }))
      .last();

    await expect(option).toBeVisible();
    await option.click();
  }

  private async setCheckbox(
    parent: Locator,
    selector: string,
    checked: boolean
  ): Promise<void> {
    const control = parent.locator(selector).first();

    await expect(control).toBeVisible();

    const tagName = await control.evaluate(
      element => element.tagName.toLowerCase()
    );

    if (tagName === 'input') {
      const type = await control.getAttribute('type');

      if (type === 'checkbox' || type === 'radio') {
        if (checked) {
          await control.check();
        } else {
          await control.uncheck();
        }
        return;
      }
    }

    const currentState = await control.getAttribute('aria-checked');

    if (currentState !== null) {
      if ((currentState === 'true') !== checked) {
        await control.click();
      }
      return;
    }

    await control.click();
  }

  private async setUseFor(
    modal: Locator,
    selectedOptions: StorageUse[]
  ): Promise<void> {
    const options: Array<{
      name: StorageUse;
      selector: string;
    }> = [
      {
        name: 'Source files',
        selector: S.modal.useFor.sourceFiles,
      },
      {
        name: 'Stream output',
        selector: S.modal.useFor.streamOutput,
      },
    ];

    for (const option of options) {
      const control = modal.locator(option.selector).first();

      if (!(await control.count())) {
        throw new Error(`Use-for option not found: ${option.name}`);
      }

      const isSelected = selectedOptions.includes(option.name);

      await this.setCheckbox(
        modal,
        option.selector,
        isSelected
      );
    }
  }

  // ---------------- Form filling ----------------

  async fillStorageForm(data: StorageFormData): Promise<void> {
    const modal = await this.getModal();

    await this.fillInput(
      modal,
      S.modal.title,
      data.title
    );

    await this.selectDropdown(
      modal,
      S.modal.kind,
      data.kind
    );

    await this.fillInput(
      modal,
      S.modal.folderPath,
      data.folderPath
    );

    await this.setCheckbox(
      modal,
      S.modal.status,
      data.active
    );

    await this.setUseFor(modal, data.useFor);

    if (data.playbackUrlBase !== undefined) {
      await this.fillInput(
        modal,
        S.modal.playbackUrlBase,
        data.playbackUrlBase
      );
    }

    await this.fillInput(
      modal,
      S.modal.maximumUsers,
      String(data.maximumUsers)
    );

    await this.selectDropdown(
      modal,
      S.modal.recording,
      data.recording
    );
  }

  async testConnection(): Promise<void> {
    const modal = await this.getModal();
    const button = modal.locator(S.modal.testConnection);

    await expect(button).toBeVisible();
    await button.click();

    // Connection result depends on the actual application response.
    // Add a specific success/failure assertion once its UI message is known.
  }

  async saveStorage(): Promise<void> {
    const modal = await this.getModal();
    const saveButton = modal.locator(S.modal.save);

    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(modal).toBeHidden();
  }

  async cancelStorage(): Promise<void> {
    const modal = await this.getModal();
    await modal.locator(S.modal.cancel).click();

    await expect(modal).toBeHidden();
  }

  // ---------------- Create ----------------

  async createStorage(data: StorageFormData): Promise<void> {
    await this.clickAddStorage();
    await this.fillStorageForm(data);
    await this.saveStorage();
    await this.verifyStorageVisible(data.title);
  }

  // ---------------- Read ----------------

  async verifyStorageDetails(data: StorageFormData): Promise<void> {
    const row = await this.getRow(data.title);

    await expect(row).toContainText(data.title);
    await expect(row).toContainText(data.kind);
    await expect(row).toContainText(data.folderPath);
    await expect(row).toContainText(String(data.maximumUsers));

    if (data.active) {
      await expect(row).toContainText(/Active/i);
    } else {
      await expect(row).toContainText(/Inactive|Disabled/i);
    }
  }

  // ---------------- Update ----------------

  async clickEditStorage(title: string): Promise<void> {
    const row = await this.getRow(title);

    await row.locator(S.rowActions.edit).first().click();
    await this.getModal();
  }

  async updateStorage(
    existingTitle: string,
    updatedData: StorageFormData
  ): Promise<void> {
    await this.clickEditStorage(existingTitle);
    await this.fillStorageForm(updatedData);
    await this.saveStorage();

    await this.verifyStorageVisible(updatedData.title);
  }

  // ---------------- Delete ----------------

  async deleteStorage(title: string): Promise<void> {
    const row = await this.getRow(title);
    const deleteButton = row.locator(S.rowActions.delete).first();

    await expect(deleteButton).toBeVisible();

    // Register the native-dialog listener before clicking Delete.
    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 1500 })
      .catch(() => null);

    await deleteButton.click();

    const nativeDialog = await dialogPromise;

    if (nativeDialog) {
      await nativeDialog.accept();
    } else {
      const confirmation = this.page
        .locator(S.confirmation.dialog)
        .filter({ has: this.page.locator(S.confirmation.confirm) })
        .last();

      if (await confirmation.count() && await confirmation.isVisible()) {
        await confirmation
          .locator(S.confirmation.confirm)
          .first()
          .click();
      }
    }

    await expect(
      this.page.locator(S.table.rows).filter({ hasText: title })
    ).toHaveCount(0);
  }

  // ---------------- Overview sections ----------------

  async verifyOverviewMetrics(): Promise<void> {
    await expect(this.page.locator(S.metrics.volumes).first()).toBeVisible();
    await expect(
      this.page.locator(S.metrics.viewerCapacity).first()
    ).toBeVisible();
    await expect(
      this.page.locator(S.metrics.recordingAllowed).first()
    ).toBeVisible();
  }

  async verifyUnreferencedUploadsSection(): Promise<void> {
    await expect(
      this.page.locator(S.unreferencedUploads.section).first()
    ).toBeVisible();
  }
}
