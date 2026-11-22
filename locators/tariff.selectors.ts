export const TariffSelectors = {
  // Update this path if your application's actual Tariffs route differs.
  route: process.env.PW_TARIFFS_PATH ?? '/Tariffs',

  listing: {
    addPackage: [
      '[data-testid="add-package"]',
      'button:has-text("+ Add package")',
      'button:has-text("Add package")',
    ],

    search: [
      '[data-testid="package-search"]',
      'input[placeholder="Search packages"]',
      'input[aria-label="Search packages"]',
    ],

    table: [
      '[data-testid="packages-table"]',
      'table',
    ],

    rows: [
      '[data-testid="package-row"]',
      'table tbody tr',
    ],

    nextPage: [
      '[data-testid="pagination-next"]',
      'button[aria-label="Next"]',
      'button:has-text("Next")',
    ],

    previousPage: [
      '[data-testid="pagination-previous"]',
      'button[aria-label="Previous"]',
      'button:has-text("Prev")',
      'button:has-text("Previous")',
    ],

    rowsPerPage: [
      '[data-testid="rows-per-page"]',
      'select[aria-label*="rows"]',
      'select[name*="pageSize"]',
    ],

    emptyState: [
      '[data-testid="empty-state"]',
      '.empty-state',
      '.no-data',
    ],
  },

  form: {
    dialog: [
      '[data-testid="package-modal"]',
      '[role="dialog"]',
      '.modal.show',
      '.modal[open]',
    ],

    packageName: [
      '[data-testid="package-name"]',
      'input[name="PackageName"]',
      'input[name="packageName"]',
      'input[placeholder="Package name"]',
    ],

    externalId: [
      '[data-testid="package-external-id"]',
      'input[name="ExternalId"]',
      'input[name="externalId"]',
      'input[placeholder="External ID"]',
    ],

    save: [
      '[data-testid="save-package"]',
      'button:has-text("Save package")',
    ],

    cancel: [
      '[data-testid="cancel-package"]',
      'button:has-text("Cancel")',
      'button:has-text("Discard")',
    ],

    close: [
      '[data-testid="close-package-modal"]',
      'button[aria-label="Close"]',
      'button[title="Close"]',
      '.modal .btn-close',
    ],
  },

  services: {
    iptv: [
      '[data-testid="service-iptv"]',
      'button:has-text("IPTV")',
      '[role="tab"]:has-text("IPTV")',
    ],

    vod: [
      '[data-testid="service-vod"]',
      'button:has-text("VoD")',
      '[role="tab"]:has-text("VoD")',
    ],

    radio: [
      '[data-testid="service-radio"]',
      'button:has-text("Radio")',
      '[role="tab"]:has-text("Radio")',
    ],

    allCategories: [
      '[data-testid="service-all-categories"]',
      'button:has-text("All categories")',
      '[role="tab"]:has-text("All categories")',
    ],
  },

  channelScope: {
    selectedOnly: [
      '[data-testid="scope-selected-only"]',
      'input[type="radio"][value="selected"]',
      'label:has-text("Selected channels only")',
    ],

    allChannels: [
      '[data-testid="scope-all-channels"]',
      'input[type="radio"][value="all"]',
      'label:has-text("All channels")',
    ],
  },

  rowActions: {
    edit: [
      '[data-testid="edit-package"]',
      'button[aria-label="Edit"]',
      'button[title="Edit"]',
      'a[title="Edit"]',
    ],

    delete: [
      '[data-testid="delete-package"]',
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