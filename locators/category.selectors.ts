
export const CategorySelectors = {
  page: {
    heading: 'Categories',
  },

  metrics: {
    total: '[data-testid="category-total"]',
    iptv: '[data-testid="category-iptv"]',
    vod: '[data-testid="category-vod"]',
    both: '[data-testid="category-both"]',
  },

  listing: {
    addButton: [
      '[data-testid="add-category"]',
      'button:has-text("+ Add category")',
      'button:has-text("Add category")',
    ],
    search: [
      '[data-testid="category-search"]',
      'input[placeholder="Search categories"]',
      'input[aria-label="Search categories"]',
    ],
    table: [
      '[data-testid="categories-table"]',
      'table',
    ],
    rows: 'tbody tr',
    emptyState: [
      '[data-testid="category-empty-state"]',
      'text=No categories found',
    ],
  },

  modal: {
    root: [
      '[data-testid="category-modal"]',
      '[role="dialog"]',
      '.modal.show',
      '.modal[open]',
    ],
    title: [
      '[data-testid="category-modal-title"]',
      'h2',
      'h3',
    ],
    name: [
      '[data-testid="category-name"]',
      'input[name="Category"]',
      'input[name="category"]',
      'input[placeholder="Category"]',
    ],
    scope: [
      '[data-testid="category-scope"]',
      'select[name="Scope"]',
      'select[name="scope"]',
      '[role="combobox"]',
    ],
    order: [
      '[data-testid="category-order"]',
      'input[name="Order"]',
      'input[name="order"]',
      'input[type="number"]',
    ],
    save: [
      '[data-testid="category-save"]',
      'button:has-text("Save")',
    ],
    cancel: [
      '[data-testid="category-cancel"]',
      'button:has-text("Cancel")',
    ],
    close: [
      '[data-testid="category-close"]',
      'button[aria-label="Close"]',
      'button.close',
    ],
  },

  table: {
    categoryCell: 'td:nth-child(2)',
    scopeCell: 'td:nth-child(3)',
    orderCell: 'td:nth-child(1)',
    editButton: [
      '[data-testid="edit-category"]',
      'button[aria-label="Edit"]',
      'button:has(svg[data-icon="pencil"])',
      'a[aria-label="Edit"]',
    ],
    deleteButton: [
      '[data-testid="delete-category"]',
      'button[aria-label="Delete"]',
      'button:has(svg[data-icon="trash"])',
      'a[aria-label="Delete"]',
    ],
  },

  confirmation: {
    dialog: [
      '[data-testid="delete-confirmation"]',
      '[role="dialog"]',
      '.modal.show',
    ],
    confirm: [
      '[data-testid="confirm-delete"]',
      'button:has-text("Delete")',
      'button:has-text("Confirm")',
      'button:has-text("Yes")',
    ],
    cancel: [
      '[data-testid="cancel-delete"]',
      'button:has-text("Cancel")',
      'button:has-text("No")',
    ],
  },

  feedback: {
    success: [
      '[data-testid="success-message"]',
      '.toast-success',
      '.alert-success',
    ],
    error: [
      '[data-testid="error-message"]',
      '.toast-error',
      '.alert-danger',
    ],
  },
} as const;

export type CategoryScope = 'IPTV' | 'VOD' | 'Both';
