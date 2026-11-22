
import { Page, Locator, expect } from '@playwright/test';

import { BasePage } from './base.page';
import {
    RolesLocators,
    getRoleRow,
} from '../locators/roles.locators';

export type PermissionModule =
    | 'Users'
    | 'Roles'
    | 'Subscribers'
    | 'Devices'
    | 'Channels'
    | 'Content'
    | 'Tariffs'
    | 'Support desk'
    | 'Marketing'
    | 'Infrastructure'
    | 'Statistics'
    | 'Audit log'
    | 'Settings'
    | 'Configurations'
    | 'Security';

export type PermissionAction = 'VIEW' | 'MANAGE';

export interface RolePermission {
    module: PermissionModule;
    action: PermissionAction;
}

export interface RoleFormData {
    roleName: string;
    permissions?: RolePermission[];
}

export class RolesPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async gotoRoles(): Promise<void> {
        await this.navigateTo('/UserManagement/RoleList');

        await this.page
            .locator(RolesLocators.addRoleButton)
            .waitFor({ state: 'visible', timeout: 15000 });
    }

    async clickAddRole(): Promise<void> {
        await this.page.locator(RolesLocators.addRoleButton).click();

        await this.page
            .locator(RolesLocators.roleNameInput)
            .waitFor({ state: 'visible', timeout: 10000 });
    }

    private getPermissionRow(module: PermissionModule): Locator {
        return this.page
            .locator(RolesLocators.permissionRows)
            .filter({ hasText: module })
            .first();
    }

    private async setPermission(
        module: PermissionModule,
        action: PermissionAction
    ): Promise<void> {
        const row = this.getPermissionRow(module);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const checkboxes = row.locator('input[type="checkbox"]');

        await expect(checkboxes).toHaveCount(2);

        const checkboxIndex = action === 'VIEW' ? 0 : 1;
        const checkbox = checkboxes.nth(checkboxIndex);

        await checkbox.check();
    }

    async selectAllViewPermissions(): Promise<void> {
        const button = this.page.locator(RolesLocators.allViewButton).last();

        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
    }

    async selectAllManagePermissions(): Promise<void> {
        const button = this.page.locator(RolesLocators.allManageButton).last();

        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
    }

    async clearPermissions(): Promise<void> {
        const button = this.page
            .locator(RolesLocators.clearPermissionsButton)
            .last();

        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
    }

    async fillRoleForm(data: RoleFormData): Promise<void> {
        const roleNameInput = this.page.locator(RolesLocators.roleNameInput);

        await roleNameInput.fill(data.roleName);

        if (data.permissions !== undefined) {
            await this.clearPermissions();

            for (const permission of data.permissions) {
                await this.setPermission(
                    permission.module,
                    permission.action
                );
            }
        }
    }

    async saveRole(): Promise<void> {
        const createButton = this.page
            .locator(RolesLocators.createRoleButton)
            .last();

        const saveButton = this.page
            .locator(RolesLocators.saveChangesButton)
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
            this.page.locator(RolesLocators.dialog)
        ).toBeHidden({ timeout: 15000 });
    }

    async searchRole(searchTerm: string): Promise<void> {
        const searchInput = this.page.locator(RolesLocators.searchInput);

        await searchInput.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await searchInput.fill(searchTerm);
    }

    async isRolePresent(roleName: string): Promise<boolean> {
        return getRoleRow(this.page, roleName)
            .isVisible()
            .catch(() => false);
    }

    async getRoleRowText(roleName: string): Promise<string> {
        const row = getRoleRow(this.page, roleName);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        return (await row.innerText()).trim();
    }

    async editRole(roleName: string): Promise<void> {
        await this.searchRole(roleName);

        const row = getRoleRow(this.page, roleName);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const editButton = row
            .locator(RolesLocators.editButton)
            .first();

        await editButton.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await editButton.click();

        await this.page
            .locator(RolesLocators.roleNameInput)
            .waitFor({ state: 'visible', timeout: 10000 });
    }

    async deleteRole(roleName: string): Promise<void> {
        await this.searchRole(roleName);

        const row = getRoleRow(this.page, roleName);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const deleteButton = row
            .locator(RolesLocators.deleteButton)
            .first();

        await deleteButton.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await deleteButton.click();

        const dialog = this.page.locator(
            RolesLocators.confirmationDialog
        );

        if (await dialog.isVisible().catch(() => false)) {
            const confirmButton = dialog
                .locator(RolesLocators.confirmDeleteButton)
                .first();

            await confirmButton.waitFor({
                state: 'visible',
                timeout: 5000,
            });

            await confirmButton.click();
        }

        await expect(row).toBeHidden({ timeout: 15000 });
    }
}
