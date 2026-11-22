
import { Page } from '@playwright/test';

export const RolesLocators = {
    // Grid and toolbar
    table: 'table, [role="grid"]',
    tableRows: 'tbody tr, [role="row"]',
    searchInput: 'input[placeholder*="Search roles"]',
    compareMatrixButton: 'button:has-text("Compare in matrix")',
    addRoleButton: 'button:has-text("Add role")',

    // Add/Edit role modal
    dialog: '[role="dialog"]',
    roleNameInput:
        'input[name="Name"], input[placeholder="Helpdesk"], input[placeholder="Name the role"]',

    // Global permission actions
    allViewButton: 'button:has-text("All view")',
    allManageButton: 'button:has-text("All manage")',
    clearPermissionsButton: 'button:has-text("Clear")',

    // Permission matrix
    permissionRows: 'tr, [role="row"]',

    // Form actions
    discardButton: 'button:has-text("Discard")',
    createRoleButton: 'button:has-text("Create role")',
    saveChangesButton: 'button:has-text("Save changes")',

    // Row actions
    statusSwitch: [
        'input[type="checkbox"]',
        '[role="switch"]',
        'button[role="switch"]',
    ].join(', '),

    viewMatrixButton: [
        'button[aria-label="View"]',
        'button[aria-label="View matrix"]',
        'button[title="View"]',
        'button[title="View matrix"]',
    ].join(', '),

    editButton: [
        'button[aria-label="Edit"]',
        'button[title="Edit"]',
        '[role="button"][aria-label="Edit"]',
    ].join(', '),

    deleteButton: [
        'button[aria-label="Delete"]',
        'button[title="Delete"]',
        'button[aria-label="Remove"]',
        'button[title="Remove"]',
    ].join(', '),

    // Delete confirmation
    confirmationDialog: '[role="dialog"]',
    confirmDeleteButton: [
        '[role="dialog"] button:has-text("Delete")',
        '[role="dialog"] button:has-text("Remove")',
        '[role="dialog"] button:has-text("Confirm")',
        '[role="dialog"] button:has-text("Yes")',
    ].join(', '),
} as const;

export function getRoleRow(page: Page, roleName: string) {
    return page
        .locator(RolesLocators.tableRows)
        .filter({ hasText: roleName })
        .first();
}
