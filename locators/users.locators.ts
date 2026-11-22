
import { Page } from '@playwright/test';

export const UsersLocators = {
    // Grid and toolbar
    table: 'table, [role="grid"]',
    tableRows: 'tbody tr, [role="row"]',
    searchInput: 'input[placeholder*="Search by user"]',
    rolesFilter: 'select[name="role"], [aria-label="Roles"]',
    statusFilter: 'select[name="status"], [aria-label="Status"]',
    addUserButton: 'button:has-text("Add user")',

    // Add/Edit user modal
    dialog: '[role="dialog"]',
    fullNameInput:
        'input[name="FullName"], input[placeholder="Full name"]',
    emailInput:
        'input[name="Email"], input[placeholder="name@nektos.local"]',
    usernameInput: 'input[name="Username"]',
    phoneInput: 'input[name="Phone"]',
    passwordInput: 'input[name="Password"]',
    confirmPasswordInput: 'input[name="ConfirmPassword"]',

    // Roles
    administratorRole: 'label:has-text("Administrator")',
    defaultRole: 'label:has-text("Default")',
    iptvManagerRole: 'label:has-text("IPTV Manager")',
    vodManagerRole: 'label:has-text("VOD Manager")',

    // Form actions
    discardButton: 'button:has-text("Discard")',
    createUserButton: 'button:has-text("Create user")',
    saveChangesButton: 'button:has-text("Save changes")',

    // Row actions
    editButton: [
        'button[aria-label="Edit"]',
        'button[title="Edit"]',
        '[role="button"][aria-label="Edit"]',
    ].join(', '),

    disableButton: [
        'button[aria-label="Disable"]',
        'button[title="Disable"]',
        'button[aria-label="Deactivate"]',
        'button[title="Deactivate"]',
    ].join(', '),

    deleteButton: [
        'button[aria-label="Delete"]',
        'button[title="Delete"]',
        'button[aria-label="Remove"]',
        'button[title="Remove"]',
    ].join(', '),

    // Confirmation dialog
    confirmationDialog: '[role="dialog"]',
    confirmDisableButton: [
        '[role="dialog"] button:has-text("Disable")',
        '[role="dialog"] button:has-text("Deactivate")',
        '[role="dialog"] button:has-text("Confirm")',
    ].join(', '),
    confirmDeleteButton: [
        '[role="dialog"] button:has-text("Delete")',
        '[role="dialog"] button:has-text("Remove")',
        '[role="dialog"] button:has-text("Confirm")',
    ].join(', '),
} as const;

export function getUserRow(page: Page, identifier: string) {
    return page
        .locator(UsersLocators.tableRows)
        .filter({ hasText: identifier })
        .first();
}
