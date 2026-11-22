
import { Locator, Page, expect } from '@playwright/test';

import { BasePage } from './base.page';
import {
    PermissionsLocators,
    getPermissionRoleRow,
} from '../locators/permissions.locators';

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

export type PermissionFilter =
    | 'kind'
    | 'status'
    | 'members'
    | 'module'
    | 'manage';

export interface ModulePermissionExpectation {
    module: PermissionModule;
    action: PermissionAction;
    expected: boolean;
}

export class PermissionsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async gotoPermissions(): Promise<void> {
        await this.navigateTo('/UserManagement/RolePermissions');

        await this.page
            .locator(PermissionsLocators.matrix)
            .first()
            .waitFor({ state: 'visible', timeout: 15000 });
    }

    private getFilterLocator(filter: PermissionFilter): Locator {
        const selectors: Record<PermissionFilter, string> = {
            kind: PermissionsLocators.kindFilter,
            status: PermissionsLocators.statusFilter,
            members: PermissionsLocators.membersFilter,
            module: PermissionsLocators.moduleFilter,
            manage: PermissionsLocators.manageFilter,
        };

        return this.page.locator(selectors[filter]).first();
    }

    async applyFilter(
        filter: PermissionFilter,
        value: string
    ): Promise<void> {
        const filterLocator = this.getFilterLocator(filter);

        await filterLocator.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const tagName = await filterLocator.evaluate(element =>
            element.tagName.toLowerCase()
        );

        if (tagName === 'select') {
            await filterLocator.selectOption({ label: value });
        } else {
            await filterLocator.click();

            const option = this.page
                .getByRole('option', { name: value, exact: true })
                .or(this.page.getByRole('menuitem', {
                    name: value,
                    exact: true,
                }))
                .or(this.page.getByText(value, { exact: true }))
                .last();

            await option.waitFor({
                state: 'visible',
                timeout: 5000,
            });

            await option.click();
        }

        await this.page.waitForLoadState('domcontentloaded').catch(() => {
            // Some filter controls update the grid without navigation.
        });
    }

    async applyKindFilter(value: string): Promise<void> {
        await this.applyFilter('kind', value);
    }

    async applyStatusFilter(value: string): Promise<void> {
        await this.applyFilter('status', value);
    }

    async applyMembersFilter(value: string): Promise<void> {
        await this.applyFilter('members', value);
    }

    async applyModuleFilter(value: PermissionModule): Promise<void> {
        await this.applyFilter('module', value);
    }

    async applyManageFilter(value: string): Promise<void> {
        await this.applyFilter('manage', value);
    }

    async searchRole(searchTerm: string): Promise<void> {
        const searchInput = this.page.locator(
            PermissionsLocators.searchInput
        );

        await searchInput.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await searchInput.fill(searchTerm);
    }

    async isRolePresent(roleName: string): Promise<boolean> {
        return getPermissionRoleRow(this.page, roleName)
            .isVisible()
            .catch(() => false);
    }

    private getRoleRow(roleName: string): Locator {
        return getPermissionRoleRow(this.page, roleName);
    }

    private async getModuleCell(
        roleName: string,
        module: PermissionModule
    ): Promise<Locator> {
        const row = this.getRoleRow(roleName);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const moduleCell = row.locator(
            `[data-module="${module}"]`
        ).first();

        if (await moduleCell.count() > 0) {
            return moduleCell;
        }

        // Fallback for tables that use module labels instead of data attributes.
        const labelledCell = row
            .getByRole('cell')
            .filter({ hasText: new RegExp(`^\\s*${module}\\s*$`, 'i') })
            .first();

        if (await labelledCell.count() > 0) {
            return labelledCell;
        }

        throw new Error(
            `Could not locate the "${module}" permission cell for role "${roleName}". ` +
            'Check the matrix DOM and add the appropriate data-module selector.'
        );
    }

    private async readPermissionState(
        cell: Locator,
        action: PermissionAction
    ): Promise<boolean> {
        const permissionName = action.toLowerCase();

        const namedPermission = cell.locator(
            `[data-permission="${permissionName}"]`
        ).first();

        if (await namedPermission.count() > 0) {
            return this.readControlState(namedPermission);
        }

        const checkboxes = cell.locator(
            PermissionsLocators.permissionCheckbox
        );

        if (await checkboxes.count() >= 2) {
            const index = action === 'VIEW' ? 0 : 1;
            return checkboxes.nth(index).isChecked();
        }

        const actionControl = cell.getByText(
            new RegExp(`^${action}$`, 'i')
        ).first();

        if (await actionControl.count() > 0) {
            return this.readControlState(actionControl);
        }

        throw new Error(
            `Could not determine ${action} permission state. ` +
            'Expected a data-permission attribute, two checkboxes, or a labelled control.'
        );
    }

    private async readControlState(control: Locator): Promise<boolean> {
        const tagName = await control.evaluate(element =>
            element.tagName.toLowerCase()
        );

        if (tagName === 'input') {
            const inputType = await control.getAttribute('type');

            if (inputType === 'checkbox' || inputType === 'radio') {
                return control.isChecked();
            }
        }

        const ariaChecked = await control.getAttribute('aria-checked');

        if (ariaChecked !== null) {
            return ariaChecked === 'true';
        }

        const ariaPressed = await control.getAttribute('aria-pressed');

        if (ariaPressed !== null) {
            return ariaPressed === 'true';
        }

        const className = await control.getAttribute('class') ?? '';

        if (/\b(active|checked|selected|enabled|granted)\b/i.test(className)) {
            return true;
        }

        if (/\b(inactive|unchecked|disabled|not-granted)\b/i.test(className)) {
            return false;
        }

        throw new Error(
            'The permission control does not expose a readable checked or active state.'
        );
    }

    async hasModulePermission(
        roleName: string,
        module: PermissionModule,
        action: PermissionAction
    ): Promise<boolean> {
        const cell = await this.getModuleCell(roleName, module);

        return this.readPermissionState(cell, action);
    }

    async verifyModulePermission(
        roleName: string,
        module: PermissionModule,
        action: PermissionAction,
        expected: boolean
    ): Promise<void> {
        const actual = await this.hasModulePermission(
            roleName,
            module,
            action
        );

        expect(
            actual,
            `${roleName} should ${expected ? 'have' : 'not have'} ${action} permission for ${module}`
        ).toBe(expected);
    }

    async verifyPermissions(
        roleName: string,
        expectations: ModulePermissionExpectation[]
    ): Promise<void> {
        for (const expectation of expectations) {
            await this.verifyModulePermission(
                roleName,
                expectation.module,
                expectation.action,
                expectation.expected
            );
        }
    }
}
