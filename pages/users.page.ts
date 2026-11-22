
import { Page, expect } from '@playwright/test';

import { BasePage } from './base.page';
import {
    UsersLocators,
    getUserRow,
} from '../locators/users.locators';

export type UserRole =
    | 'Administrator'
    | 'Default'
    | 'IPTV Manager'
    | 'VOD Manager';

export interface UserFormData {
    fullName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    username?: string;
    phone?: string;
    roles?: UserRole[];
}

export type UserRemovalAction = 'disabled' | 'deleted';

export class UsersPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async gotoUsers(): Promise<void> {
        await this.navigateTo('/UserManagement');

        await this.page
            .locator(UsersLocators.addUserButton)
            .waitFor({ state: 'visible', timeout: 15000 });
    }

    async clickAddUser(): Promise<void> {
        await this.page.locator(UsersLocators.addUserButton).click();

        await this.page
            .locator(UsersLocators.fullNameInput)
            .waitFor({ state: 'visible', timeout: 10000 });
    }

    private async fillIfProvided(
        selector: string,
        value: string | undefined
    ): Promise<void> {
        if (value === undefined) {
            return;
        }

        await this.page.locator(selector).fill(value);
    }

    private async selectRoles(roles: UserRole[]): Promise<void> {
        const roleSelectors: Record<UserRole, string> = {
            Administrator: UsersLocators.administratorRole,
            Default: UsersLocators.defaultRole,
            'IPTV Manager': UsersLocators.iptvManagerRole,
            'VOD Manager': UsersLocators.vodManagerRole,
        };

        for (const role of roles) {
            const roleLabel = this.page.locator(roleSelectors[role]).last();

            await roleLabel.waitFor({
                state: 'visible',
                timeout: 10000,
            });

            const checkbox = roleLabel.locator('input[type="checkbox"]');

            if (await checkbox.count() > 0) {
                await checkbox.check();
            } else {
                await roleLabel.click();
            }
        }
    }

    async fillUserForm(data: UserFormData): Promise<void> {
        await this.fillIfProvided(
            UsersLocators.fullNameInput,
            data.fullName
        );

        await this.fillIfProvided(
            UsersLocators.emailInput,
            data.email
        );

        await this.fillIfProvided(
            UsersLocators.usernameInput,
            data.username
        );

        await this.fillIfProvided(
            UsersLocators.phoneInput,
            data.phone
        );

        if (data.password !== undefined) {
            await this.page
                .locator(UsersLocators.passwordInput)
                .fill(data.password);

            await this.page
                .locator(UsersLocators.confirmPasswordInput)
                .fill(data.confirmPassword ?? data.password);
        }

        if (data.roles !== undefined) {
            await this.selectRoles(data.roles);
        }
    }

    async saveUser(): Promise<void> {
        const createButton = this.page
            .locator(UsersLocators.createUserButton)
            .last();

        const saveButton = this.page
            .locator(UsersLocators.saveChangesButton)
            .last();

        if (await createButton.isVisible().catch(() => false)) {
            await expect(createButton).toBeEnabled();
            await createButton.click();
        } else {
            await saveButton.waitFor({
                state: 'visible',
                timeout: 10000,
            });

            await expect(saveButton).toBeEnabled();
            await saveButton.click();
        }

        await expect(
            this.page.locator(UsersLocators.dialog)
        ).toBeHidden({ timeout: 15000 });
    }

    async searchUser(searchTerm: string): Promise<void> {
        const searchInput = this.page.locator(UsersLocators.searchInput);

        await searchInput.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await searchInput.fill(searchTerm);
    }

    async isUserPresent(identifier: string): Promise<boolean> {
        return getUserRow(this.page, identifier)
            .isVisible()
            .catch(() => false);
    }

    async getUserRowText(identifier: string): Promise<string> {
        const row = getUserRow(this.page, identifier);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        return (await row.innerText()).trim();
    }

    async getUserStatus(identifier: string): Promise<string> {
        const rowText = await this.getUserRowText(identifier);
        const status = rowText.match(/\b(active|enabled|disabled|inactive)\b/i);

        return status?.[0] ?? '';
    }

    async editUser(identifier: string): Promise<void> {
        await this.searchUser(identifier);

        const row = getUserRow(this.page, identifier);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const editButton = row
            .locator(UsersLocators.editButton)
            .first();

        await editButton.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await editButton.click();

        await this.page
            .locator(UsersLocators.fullNameInput)
            .waitFor({ state: 'visible', timeout: 10000 });
    }

    async deleteOrDisableUser(
        identifier: string
    ): Promise<UserRemovalAction> {
        await this.searchUser(identifier);

        const row = getUserRow(this.page, identifier);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const disableButton = row
            .locator(UsersLocators.disableButton)
            .first();

        if (await disableButton.isVisible().catch(() => false)) {
            await disableButton.click();

            const dialog = this.page.locator(
                UsersLocators.confirmationDialog
            );

            if (await dialog.isVisible().catch(() => false)) {
                const confirmButton = dialog
                    .locator(UsersLocators.confirmDisableButton)
                    .first();

                await confirmButton.waitFor({
                    state: 'visible',
                    timeout: 5000,
                });

                await confirmButton.click();
            }

            await expect
                .poll(
                    async () => {
                        if (!(await row.isVisible().catch(() => false))) {
                            return 'deleted';
                        }

                        const text = await row.innerText();
                        return /\b(disabled|inactive)\b/i.test(text)
                            ? 'disabled'
                            : 'pending';
                    },
                    { timeout: 15000 }
                )
                .not.toBe('pending');

            return (await row.isVisible().catch(() => false))
                ? 'disabled'
                : 'deleted';
        }

        const deleteButton = row
            .locator(UsersLocators.deleteButton)
            .first();

        await deleteButton.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await deleteButton.click();

        const dialog = this.page.locator(
            UsersLocators.confirmationDialog
        );

        if (await dialog.isVisible().catch(() => false)) {
            const confirmButton = dialog
                .locator(UsersLocators.confirmDeleteButton)
                .first();

            await confirmButton.waitFor({
                state: 'visible',
                timeout: 5000,
            });

            await confirmButton.click();
        }

        await expect(row).toBeHidden({ timeout: 15000 });

        return 'deleted';
    }
}
