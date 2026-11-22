
export const MultiFilterSelectors = {
  page: {
    heading: 'Multi Filter',
  },

  metrics: {
    savedFilters: '[data-testid="saved-filters"]',
    presets: '[data-testid="filter-presets"]',
    rulesInUse: '[data-testid="rules-in-use"]',
    lastUpdated: '[data-testid="last-updated"]',
  },

  listing: {
    newFilterButton: [
      '[data-testid="new-filter"]',
      'button:has-text("+ New filter")',
      'button:has-text("New filter")',
    ],

    search: [
      '[data-testid="filter-search"]',
      'input[placeholder="Search filters"]',
      'input[aria-label="Search filters"]',
    ],

    tabs: {
      all: 'All',
      presets: 'Presets',
      custom: 'Custom',
    },

    table: [
      '[data-testid="multi-filter-table"]',
      'table',
    ],

    rows: 'tbody tr',
    emptyState: [
      '[data-testid="filter-empty-state"]',
      'text=No filters found',
    ],
  },

  modal: {
    root: [
      '[data-testid="filter-modal"]',
      '[role="dialog"]',
      '.modal.show',
      '.modal[open]',
    ],

    name: [
      '[data-testid="filter-name"]',
      'input[name="name"]',
      'input[name="filterName"]',
      'input[placeholder="Filter name"]',
    ],

    description: [
      '[data-testid="filter-description"]',
      'textarea[name="description"]',
      'input[name="description"]',
      'textarea[placeholder="Description"]',
    ],

    preset: [
      '[data-testid="filter-preset"]',
      'input[name="isPreset"]',
      'input[name="preset"]',
      '[role="switch"]',
    ],

    categoryTabs: {
      accountGroup: 'Account group',
      content: 'Content',
    },

    matchCriteria: [
      '[data-testid="match-criteria"]',
      'select[name="matchCriteria"]',
      '[name="match"]',
    ],

    rules: {
      container: [
        '[data-testid="filter-rules"]',
        '.rules-builder',
      ],

      row: [
        '[data-testid="filter-rule"]',
        '.rule-row',
      ],

      field: [
        '[data-testid="rule-field"]',
        'select[name="field"]',
        '[name="field"]',
      ],

      condition: [
        '[data-testid="rule-condition"]',
        'select[name="condition"]',
        '[name="condition"]',
      ],

      value: [
        '[data-testid="rule-value"]',
        'input[name="value"]',
        'select[name="value"]',
        '[name="value"]',
      ],

      addRule: [
        '[data-testid="add-rule"]',
        'button:has-text("+ Add rule")',
        'button:has-text("Add rule")',
      ],

      addGroup: [
        '[data-testid="add-rule-group"]',
        'button:has-text("+ Add group")',
        'button:has-text("Add group")',
      ],
    },

    sqlPreview: {
      section: [
        '[data-testid="sql-preview"]',
        'text=SQL preview',
      ],

      previewButton: [
        '[data-testid="preview-sql"]',
        'button:has-text("Preview SQL")',
      ],

      testButton: [
        '[data-testid="test-filter"]',
        'button:has-text("Test")',
      ],
    },

    save: [
      '[data-testid="save-filter"]',
      'button:has-text("Create filter")',
      'button:has-text("Save")',
    ],

    cancel: [
      '[data-testid="cancel-filter"]',
      'button:has-text("Cancel")',
    ],

    close: [
      '[data-testid="close-filter-modal"]',
      'button[aria-label="Close"]',
      'button.close',
    ],
  },

  table: {
    nameCell: 'td:nth-child(1)',
    rulesCell: 'td:nth-child(2)',
    categoryCell: 'td:nth-child(3)',

    cloneButton: [
      '[data-testid="clone-filter"]',
      'button[aria-label="Clone"]',
      'button[title="Clone"]',
    ],

    editButton: [
      '[data-testid="edit-filter"]',
      'button[aria-label="Edit"]',
      'button[title="Edit"]',
    ],

    deleteButton: [
      '[data-testid="delete-filter"]',
      'button[aria-label="Delete"]',
      'button[title="Delete"]',
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

export type FilterCategory = 'Account group' | 'Content';

export type MatchCriteria = 'All rules' | 'Any rules';
