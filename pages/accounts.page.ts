
import {
  expect,
  Locator,
  Page,
} from '@playwright/test';

import { BasePage } from './base.page';
import { AccountSelectors as S } from '../locators/account.selectors';

export interface AccountFormData {
  username: string;
  password?: string;

  group: string;
  tariffPlan: string;
  balance: string | number;

  externalId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;

  phone?: string;
  authPhone?: string;
  email?: string;
  city?: string;

  parentPin?: string;
  masterPin?: string;
  deviceServices?: string | number;
  appServices?: string | number;

  comments?: string;
  isActive?: boolean;
}

type AccountField = keyof typeof S.fields;

export class AccountsPage extends BasePage {
  private readonly pageModal: Locator;

  constructor(page: Page) {
    super(page);
    this.pageModal = page.locator(S.modal.root.join(', ')).last();
  }

  // -------------------------------------------------------
  // Locator helper
  // -------------------------------------------------------

  private async visibleLocator(
    parent: Page | Locator,
    selectors: readonly string[],
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

  private async field(name: AccountField): Promise<Locator> {
    return this.visibleLocator(
      this.pageModal,
      S.fields[name],
    );
  }

  private async fillField(
    name: AccountField,
    value: string | number | undefined,
  ): Promise<void> {
    if (value === undefined) {
      return;
    }

    const locator = await this.field(name);

    await expect(locator).toBeVisible();
    await locator.fill(String(value));
  }

  // -------------------------------------------------------
  // Navigation
  // -------------------------------------------------------

  async gotoAccounts(): Promise<void> {
    await this.navigateTo(S.route);
    await this.waitForPageLoad();

    const search = await this.visibleLocator(
      this.page,
      S.listing.search,
    );

    await expect(search).toBeVisible();
  }

  // -------------------------------------------------------
  // Modal
  // -------------------------------------------------------

  async openAddAccountModal(): Promise<void> {
    const addButton = await this.visibleLocator(
      this.page,
      S.listing.addAccount,
    );

    await addButton.click();

    await expect(this.pageModal).toBeVisible();

    const username = await this.field('username');
    await expect(username).toBeVisible();
  }

  async closeModal(): Promise<void> {
    const closeButton = await this.visibleLocator(
      this.pageModal,
      S.modal.close,
    );

    await closeButton.click();
    await expect(this.pageModal).toBeHidden();
  }

  async discardAccount(): Promise<void> {
    const discardButton = await this.visibleLocator(
      this.pageModal,
      S.modal.discard,
    );

    await discardButton.click();
    await expect(this.pageModal).toBeHidden();
  }

  // -------------------------------------------------------
  // Dropdown handling
  // -------------------------------------------------------

  private async selectDropdown(
    name: 'group' | 'tariffPlan',
    value: string,
  ): Promise<void> {
    const locator = await this.field(name);

    const tagName = await locator.evaluate(
      (element) => element.tagName.toLowerCase(),
    );

    if (tagName === 'select') {
      await locator.selectOption({ label: value });
      return;
    }

    await locator.click();

    const option = this.page.getByText(value, {
      exact: true,
    }).last();

    await expect(option).toBeVisible();
    await option.click();
  }

  // -------------------------------------------------------
  // Status handling
  // -------------------------------------------------------

  private async setModalStatus(
    isActive: boolean,
  ): Promise<void> {
    for (const selector of S.status.input) {
      const input = this.pageModal.locator(selector).first();

      if (await input.isVisible().catch(() => false)) {
        const currentValue = await input.isChecked();

        if (currentValue !== isActive) {
          await input.setChecked(isActive);
        }

        return;
      }
    }

    const toggle = await this.visibleLocator(
      this.pageModal,
      S.status.toggle,
    );

    await toggle.click();
  }

  // -------------------------------------------------------
  // Form
  // -------------------------------------------------------

  async fillAccountForm(
    data: AccountFormData,
  ): Promise<void> {
    await expect(this.pageModal).toBeVisible();

    await this.fillField('username', data.username);
    await this.fillField('password', data.password);

    await this.selectDropdown('group', data.group);
    await this.selectDropdown('tariffPlan', data.tariffPlan);

    await this.fillField('balance', data.balance);
    await this.fillField('externalId', data.externalId);

    await this.fillField('firstName', data.firstName);
    await this.fillField('middleName', data.middleName);
    await this.fillField('lastName', data.lastName);

    await this.fillField('phone', data.phone);
    await this.fillField('authPhone', data.authPhone);
    await this.fillField('email', data.email);
    await this.fillField('city', data.city);

    await this.fillField('parentPin', data.parentPin);
    await this.fillField('masterPin', data.masterPin);

    await this.fillField(
      'deviceServices',
      data.deviceServices,
    );

    await this.fillField(
      'appServices',
      data.appServices,
    );

    await this.fillField('comments', data.comments);

    if (data.isActive !== undefined) {
      await this.setModalStatus(data.isActive);
    }
  }

  // -------------------------------------------------------
  // Create
  // -------------------------------------------------------

  async createAccount(
    data: AccountFormData,
  ): Promise<void> {
    await this.openAddAccountModal();
    await this.fillAccountForm(data);

    const createButton = await this.visibleLocator(
      this.pageModal,
      S.modal.create,
    );

    await expect(createButton).toBeEnabled();
    await createButton.click();

    await expect(this.pageModal).toBeHidden({
      timeout: 15000,
    });
  }

  // -------------------------------------------------------
  // Search
  // -------------------------------------------------------

  async searchAccount(value: string): Promise<void> {
    const search = await this.visibleLocator(
      this.page,
      S.listing.search,
    );

    await search.fill(value);

    // Wait until the listing reflects the search.
    await expect(async () => {
      const rows = await this.visibleLocator(
        this.page,
        S.listing.rows,
      ).catch(() => null);

      const matchingRow = rows
        ? rows.filter({ hasText: value })
        : null;

      const hasMatch = matchingRow
        ? await matchingRow.count() > 0
        : false;

      const emptyState = this.page.locator(
        S.listing.emptyState.join(', '),
      ).first();

      const isEmpty = await emptyState.isVisible().catch(
        () => false,
      );

      expect(hasMatch || isEmpty).toBeTruthy();
    }).toPass({ timeout: 10000 });
  }

  async getAccountRow(
    identifier: string,
  ): Promise<Locator> {
    const rows = this.page.locator(
      S.listing.rows.join(', '),
    );

    const row = rows.filter({
      hasText: identifier,
    }).first();

    await expect(row).toBeVisible({
      timeout: 10000,
    });

    return row;
  }

  async isAccountPresent(
    identifier: string,
  ): Promise<boolean> {
    const rows = this.page.locator(
      S.listing.rows.join(', '),
    );

    return rows.filter({
      hasText: identifier,
    }).first().isVisible().catch(() => false);
  }

  async verifyAccountVisible(
    identifier: string,
  ): Promise<void> {
    await expect(
      await this.getAccountRow(identifier),
    ).toBeVisible();
  }

  async verifyAccountNotVisible(
    identifier: string,
  ): Promise<void> {
    const rows = this.page.locator(
      S.listing.rows.join(', '),
    );

    await expect(
      rows.filter({ hasText: identifier }),
    ).toHaveCount(0);
  }

  // -------------------------------------------------------
  // Update
  // -------------------------------------------------------

  async editAccount(
    identifier: string,
    changes: Partial<AccountFormData>,
  ): Promise<void> {
    const row = await this.getAccountRow(identifier);

    const editButton = await this.visibleLocator(
      row,
      S.rowActions.edit,
    );

    await editButton.click();
    await expect(this.pageModal).toBeVisible();

    const editableFields: AccountField[] = [
      'username',
      'password',
      'balance',
      'externalId',
      'firstName',
      'middleName',
      'lastName',
      'phone',
      'authPhone',
      'email',
      'city',
      'parentPin',
      'masterPin',
      'deviceServices',
      'appServices',
      'comments',
    ];

    for (const name of editableFields) {
      const value = changes[name];

      if (
        typeof value === 'string' ||
        typeof value === 'number'
      ) {
        await this.fillField(name, value);
      }
    }

    if (changes.group !== undefined) {
      await this.selectDropdown('group', changes.group);
    }

    if (changes.tariffPlan !== undefined) {
      await this.selectDropdown(
        'tariffPlan',
        changes.tariffPlan,
      );
    }

    if (changes.isActive !== undefined) {
      await this.setModalStatus(changes.isActive);
    }

    await this.saveAccountChanges();
  }

  async saveAccountChanges(): Promise<void> {
    const saveButton = await this.visibleLocator(
      this.pageModal,
      S.modal.save,
    );

    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(this.pageModal).toBeHidden({
      timeout: 15000,
    });
  }

  // -------------------------------------------------------
  // Row status toggle
  // -------------------------------------------------------

  async toggleAccountStatus(
    identifier: string,
  ): Promise<void> {
    const row = await this.getAccountRow(identifier);

    const toggle = await this.visibleLocator(
      row,
      S.rowActions.status,
    );

    const type = await toggle.getAttribute('type');

    if (type === 'checkbox') {
      await toggle.setChecked(
        !(await toggle.isChecked()),
      );
    } else {
      await toggle.click();
    }
  }

  // -------------------------------------------------------
  // Delete
  // -------------------------------------------------------

  async deleteAccount(
    identifier: string,
  ): Promise<void> {
    const row = await this.getAccountRow(identifier);

    const deleteButton = await this.visibleLocator(
      row,
      S.rowActions.delete,
    );

    await deleteButton.click();

    const confirmButton = await this.visibleLocator(
      this.page,
      S.rowActions.confirmDelete,
    );

    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    await expect(row).toBeHidden({
      timeout: 15000,
    });
  }

  // -------------------------------------------------------
  // Validation
  // -------------------------------------------------------

  async submitEmptyAccountForm(): Promise<void> {
    await this.openAddAccountModal();

    const createButton = await this.visibleLocator(
      this.pageModal,
      S.modal.create,
    );

    await createButton.click();
    await expect(this.pageModal).toBeVisible();
  }

  async verifyValidationErrorVisible(): Promise<void> {
    const error = await this.visibleLocator(
      this.pageModal,
      S.validation.errors,
    );

    await expect(error).toBeVisible();
  }

  async verifyDuplicateUsernameError(): Promise<void> {
    const error = await this.visibleLocator(
      this.pageModal,
      S.validation.duplicateUsername,
    );

    await expect(error).toBeVisible();
  }

  async verifyEmailInvalid(): Promise<void> {
    const email = await this.field('email');

    const valid = await email.evaluate(
      (element: HTMLInputElement) => element.validity.valid,
    );

    expect(valid).toBeFalsy();
  }

  async getEmailField(): Promise<Locator> {
    return this.field('email');
  }

  async getUsernameField(): Promise<Locator> {
    return this.field('username');
  }

  async getCreateButton(): Promise<Locator> {
    return this.visibleLocator(
      this.pageModal,
      S.modal.create,
    );
  }

  async getModal(): Promise<Locator> {
    return this.pageModal;
  }
}
