export const DeviceSelectors = {
    route: process.env.PW_DEVICES_PATH ?? '/Devices',

    listing: {
        registerDevice: [
            '[data-testid="register-device"]',
            'button:has-text("+ Register device")',
            'button:has-text("Register device")',
        ],

        search: [
            '[data-testid="device-search"]',
            'input[placeholder="Search account, device id..."]',
            'input[aria-label="Search account, device id..."]',
        ],

        table: [
            '[data-testid="devices-table"]',
            'table',
        ],

        rows: [
            '[data-testid="device-row"]',
            'table tbody tr',
        ],

        emptyState: [
            '[data-testid="empty-state"]',
            '.empty-state',
            '.no-data',
        ],
    },

    modal: {
        root: [
            '[data-testid="device-modal"]',
            '[role="dialog"]',
            '.modal.show',
            '.modal[open]',
        ],

        account: [
            '[data-testid="device-account"]',
            'select[name="AccountId"]',
            'select[name="accountId"]',
            'input[name="Account"]',
            '[name="AccountId"]',
        ],

        deviceType: [
            '[data-testid="device-type"]',
            'select[name="DeviceType"]',
            'select[name="deviceType"]',
            'input[name="DeviceType"]',
        ],

        deviceOs: [
            '[data-testid="device-os"]',
            'select[name="DeviceOS"]',
            'select[name="deviceOs"]',
            'input[name="DeviceOS"]',
        ],

        identifier: [
            '[data-testid="device-identifier"]',
            'input[name="MacAddress"]',
            'input[name="MAC"]',
            'input[name="Identifier"]',
            'input[placeholder*="MAC"]',
            'input[placeholder*="Identifier"]',
        ],

        active: [
            '[data-testid="device-active"] input',
            'input[name="IsActive"]',
            'input[name="Active"]',
            'input[name="isActive"]',
        ],

        activeToggle: [
            '[data-testid="device-active"]',
            'label:has(input[name="IsActive"])',
            'label:has(input[name="Active"])',
            '.form-switch',
        ],

        register: [
            '[data-testid="save-device"]',
            'button:has-text("Register")',
            'button:has-text("Register device")',
        ],

        save: [
            '[data-testid="save-device"]',
            'button:has-text("Save changes")',
            'button:has-text("Save")',
        ],

        cancel: [
            '[data-testid="cancel-device"]',
            'button:has-text("Cancel")',
        ],

        close: [
            '[data-testid="close-device-modal"]',
            'button[aria-label="Close"]',
            'button[title="Close"]',
            '.modal .btn-close',
        ],
    },

    dropdown: {
        options: [
            '[role="option"]',
            '.dropdown-menu.show button',
            '.dropdown-menu.show a',
            '.select2-results__option',
        ],
    },

    rowActions: {
        edit: [
            '[data-testid="edit-device"]',
            'button[aria-label="Edit"]',
            'button[title="Edit"]',
            'a[title="Edit"]',
        ],

        delete: [
            '[data-testid="delete-device"]',
            'button[aria-label="Delete"]',
            'button[title="Delete"]',
            'a[title="Delete"]',
        ],
    },

    confirmation: {
        dialog: [
            '[data-testid="delete-confirmation"]',
            '[role="alertdialog"]',
            '[role="dialog"]',
            '.modal.show',
        ],

        confirm: [
            '[data-testid="confirm-delete"]',
            'button:has-text("Delete")',
            'button:has-text("Confirm")',
        ],

        cancel: [
            '[data-testid="cancel-delete"]',
            'button:has-text("Cancel")',
        ],
    },

    feedback: {
        success: [
            '[data-testid="success-message"]',
            '[role="status"]',
            '.toast-success',
            '.alert-success',
        ],

        error: [
            '[data-testid="error-message"]',
            '[role="alert"]',
            '.toast-error',
            '.alert-danger',
        ],
    },
} as const;