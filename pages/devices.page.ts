import { expect, Locator, Page } from '@playwright/test';

import { BasePage } from './base.page';
import { DeviceSelectors as S } from '../locators/device.selectors';

export type DeviceType =
    | 'MAG'
    | 'Android TV'
    | 'Android Phone';

export type DeviceOS =
    | 'Android'
    | 'Linux';

export interface DeviceFormData {
    account: string;
    deviceType: DeviceType;
    deviceOs: DeviceOS;
    identifier: string;
    isActive: boolean;
}

type SelectorList = readonly string[];

export class DevicesPage extends BasePage {
    private readonly modal: Locator;

    constructor(page: Page) {
        super(page);

        this.modal = page
            .locator(S.modal.root.join(', '))
            .last();
    }

    // -----------------------------------------------------------------------
    // Common locator helpers
    // -----------------------------------------------------------------------

    private async visibleLocator(
        parent: Page | Locator,
        selectors: SelectorList,
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

    private async optionalVisibleLocator(
        parent: Page | Locator,
        selectors: SelectorList,
    ): Promise<Locator | null> {
        for (const selector of selectors) {
            const locator = parent.locator(selector).first();

            if (await locator.isVisible().catch(() => false)) {
                return locator;
            }
        }

        return null;
    }

    private async clickUsingSelectors(
        parent: Page | Locator,
        selectors: SelectorList,
    ): Promise<void> {
        const locator = await this.visibleLocator(parent, selectors);
        await locator.click();
    }

    private async fillUsingSelectors(
        parent: Page | Locator,
        selectors: SelectorList,
        value: string,
    ): Promise<void> {
        const locator = await this.visibleLocator(parent, selectors);
        await locator.fill(value);
    }

    // -----------------------------------------------------------------------
    // Navigation
    // -----------------------------------------------------------------------

    async gotoDevices(): Promise<void> {
        await this.navigateToModule(S.route);

        const registerButton = await this.visibleLocator(
            this.page,
            S.listing.registerDevice,
        );

        await expect(registerButton).toBeVisible();
    }

    // -----------------------------------------------------------------------
    // Register / Edit modal
    // -----------------------------------------------------------------------

    async openRegisterDeviceModal(): Promise<void> {
        await this.clickUsingSelectors(
            this.page,
            S.listing.registerDevice,
        );

        await expect(this.modal).toBeVisible();
    }

    getDeviceModal(): Locator {
        return this.modal;
    }

    async cancelDeviceForm(): Promise<void> {
        await this.clickUsingSelectors(
            this.modal,
            S.modal.cancel,
        );

        await expect(this.modal).toBeHidden();
    }

    async closeDeviceForm(): Promise<void> {
        await this.clickUsingSelectors(
            this.modal,
            S.modal.close,
        );

        await expect(this.modal).toBeHidden();
    }

    // -----------------------------------------------------------------------
    // Dropdowns
    // -----------------------------------------------------------------------

    /**
     * Supports native HTML select and custom dropdown controls.
     * Native select options are matched by value or visible label.
     */
    private async selectDropdown(
        selectors: SelectorList,
        value: string,
    ): Promise<void> {
        const dropdown = await this.visibleLocator(
            this.modal,
            selectors,
        );

        const tagName = await dropdown.evaluate(
            element => element.tagName.toLowerCase(),
        );

        if (tagName === 'select') {
            const options = await dropdown.locator('option').evaluateAll(
                elements => elements.map(option => ({
                    value: (option as HTMLOptionElement).value,
                    label: option.textContent?.trim() ?? '',
                })),
            );

            const matchingOption = options.find(
                option =>
                    option.value === value ||
                    option.label === value,
            );

            if (!matchingOption) {
                throw new Error(
                    `Option "${value}" was not found in the dropdown.`,
                );
            }

            await dropdown.selectOption(matchingOption.value);
            return;
        }

        await dropdown.click();

        const option = this.page
            .locator(S.dropdown.options.join(', '))
            .filter({ hasText: value })
            .first();

        await expect(option).toBeVisible();
        await option.click();
    }

    async selectAccount(account: string): Promise<void> {
        await this.selectDropdown(S.modal.account, account);
    }

    async selectDeviceType(deviceType: DeviceType): Promise<void> {
        await this.selectDropdown(S.modal.deviceType, deviceType);
    }

    async selectDeviceOs(deviceOs: DeviceOS): Promise<void> {
        await this.selectDropdown(S.modal.deviceOs, deviceOs);
    }

    // -----------------------------------------------------------------------
    // Form fields
    // -----------------------------------------------------------------------

    async fillIdentifier(identifier: string): Promise<void> {
        await this.fillUsingSelectors(
            this.modal,
            S.modal.identifier,
            identifier,
        );
    }

    /**
     * Handles visible and visually-hidden checkbox inputs.
     * If the checkbox is hidden, click its associated visible toggle.
     */
    async setActiveStatus(isActive: boolean): Promise<void> {
        const checkbox = this.modal
            .locator(S.modal.active.join(', '))
            .first();

        await expect(checkbox).toHaveCount(1);

        const currentlyActive = await checkbox.isChecked();

        if (currentlyActive === isActive) {
            return;
        }

        if (await checkbox.isVisible()) {
            await checkbox.setChecked(isActive);
        } else {
            const toggle = await this.visibleLocator(
                this.modal,
                S.modal.activeToggle,
            );

            await toggle.click();
        }

        await expect(checkbox).toBeChecked({
            checked: isActive,
        });
    }

    async fillDeviceForm(data: DeviceFormData): Promise<void> {
        await this.selectAccount(data.account);
        await this.selectDeviceType(data.deviceType);
        await this.selectDeviceOs(data.deviceOs);
        await this.fillIdentifier(data.identifier);
        await this.setActiveStatus(data.isActive);
    }

    // -----------------------------------------------------------------------
    // Create
    // -----------------------------------------------------------------------

    async registerDevice(data: DeviceFormData): Promise<void> {
        await this.openRegisterDeviceModal();
        await this.fillDeviceForm(data);

        await this.clickUsingSelectors(
            this.modal,
            S.modal.register,
        );

        await expect(this.modal).toBeHidden({
            timeout: 15000,
        });
    }

    // -----------------------------------------------------------------------
    // Read / Search
    // -----------------------------------------------------------------------

    async searchDevice(searchText: string): Promise<void> {
        const search = await this.visibleLocator(
            this.page,
            S.listing.search,
        );

        await search.fill(searchText);
        await expect(search).toHaveValue(searchText);
    }

    async clearSearch(): Promise<void> {
        const search = await this.visibleLocator(
            this.page,
            S.listing.search,
        );

        await search.clear();
        await expect(search).toHaveValue('');
    }

    private getDeviceRows(): Locator {
        return this.page.locator(S.listing.rows.join(', '));
    }

    async getDeviceRow(identifier: string): Promise<Locator> {
        return this.getDeviceRows()
            .filter({ hasText: identifier })
            .first();
    }

    async verifyDeviceVisible(identifier: string): Promise<void> {
        const row = await this.getDeviceRow(identifier);
        await expect(row).toBeVisible();
    }

    async verifyDeviceNotVisible(identifier: string): Promise<void> {
        const row = await this.getDeviceRow(identifier);
        await expect(row).toHaveCount(0);
    }

    // -----------------------------------------------------------------------
    // Update
    // -----------------------------------------------------------------------

    async openEditDevice(identifier: string): Promise<void> {
        const row = await this.getDeviceRow(identifier);

        await expect(row).toBeVisible();

        await this.clickUsingSelectors(
            row,
            S.rowActions.edit,
        );

        await expect(this.modal).toBeVisible();
    }

    async updateDevice(
        identifier: string,
        updates: Partial<DeviceFormData>,
    ): Promise<void> {
        await this.openEditDevice(identifier);

        if (updates.account !== undefined) {
            await this.selectAccount(updates.account);
        }

        if (updates.deviceType !== undefined) {
            await this.selectDeviceType(updates.deviceType);
        }

        if (updates.deviceOs !== undefined) {
            await this.selectDeviceOs(updates.deviceOs);
        }

        if (updates.identifier !== undefined) {
            await this.fillIdentifier(updates.identifier);
        }

        if (updates.isActive !== undefined) {
            await this.setActiveStatus(updates.isActive);
        }

        await this.clickUsingSelectors(
            this.modal,
            S.modal.save,
        );

        await expect(this.modal).toBeHidden({
            timeout: 15000,
        });
    }

    // -----------------------------------------------------------------------
    // Delete
    // -----------------------------------------------------------------------

    async deleteDevice(identifier: string): Promise<void> {
        const row = await this.getDeviceRow(identifier);

        await expect(row).toBeVisible();

        await this.clickUsingSelectors(
            row,
            S.rowActions.delete,
        );

        const confirmation = await this.optionalVisibleLocator(
            this.page,
            S.confirmation.dialog,
        );

        if (confirmation) {
            await this.clickUsingSelectors(
                confirmation,
                S.confirmation.confirm,
            );
        }

        await expect(row).toHaveCount(0, {
            timeout: 15000,
        });
    }

    // -----------------------------------------------------------------------
    // Feedback
    // -----------------------------------------------------------------------

    async verifySuccessMessage(): Promise<void> {
        const message = await this.visibleLocator(
            this.page,
            S.feedback.success,
        );

        await expect(message).toBeVisible();
    }
}
