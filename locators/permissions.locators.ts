
import { Page } from '@playwright/test';

export const PermissionsLocators = {
    // Matrix grid
    matrix: 'table, [role="grid"]',
    matrixRows: 'tbody tr, [role="row"]',
    searchInput: 'input[placeholder*="Search roles"]',

    // Filters
    kindFilter: [
        'select[name="Kind"]',
        'select[name="kind"]',
        '[aria-label="Kind"]',
        '[data-filter="kind"]',
    ].join(', '),

    statusFilter: [
        'select[name="Status"]',
        'select[name="status"]',
        '[aria-label="Status"]',
        '[data-filter="status"]',
    ].join(', '),

    membersFilter: [
        'select[name="Members"]',
        'select[name="members"]',
        '[aria-label="Members"]',
        '[data-filter="members"]',
    ].join(', '),

    moduleFilter: [
        'select[name="Module"]',
        'select[name="module"]',
        '[aria-label="Module"]',
        '[data-filter="module"]',
        '[aria-label="Holds module"]',
    ].join(', '),

    manageFilter: [
        'select[name="Manage"]',
        'select[name="manage"]',
        '[aria-label="Manage"]',
        '[data-filter="manage"]',
    ].join(', '),

    // Matrix cell structure
    moduleCell: '[data-module]',
    permissionCell: '[data-permission]',
    permissionCheckbox: 'input[type="checkbox"]',
} as const;

export function getPermissionRoleRow(page: Page, roleName: string) {
    return page
        .locator(PermissionsLocators.matrixRows)
        .filter({ hasText: roleName })
        .first();
}
