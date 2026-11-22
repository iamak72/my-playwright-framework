
export const ScreenSelectors = {
  page: {
    heading: [
      'h1:has-text("Screens")',
      'h2:has-text("Screens")',
      'text=Screens',
    ],
    addButton: [
      'button:has-text("Add screen")',
      'a:has-text("Add screen")',
      '[data-testid="add-screen"]',
    ],
    search: [
      'input[placeholder*="Search"]',
      'input[aria-label*="Search"]',
    ],
    count: [
      '[data-testid="screens-count"]',
      '.screens-count',
    ],
  },

  form: {
    root: [
      '[data-testid="screen-form"]',
      '[role="dialog"]',
      'form',
    ],

    sections: {
      details: [
        'text=Details',
        'button:has-text("Details")',
      ],
      look: [
        'text=Look',
        'button:has-text("Look")',
      ],
      background: [
        'text=Background',
        'button:has-text("Background")',
      ],
      deviceTypes: [
        'text=Device types',
        'button:has-text("Device types")',
      ],
      audience: [
        'text=Who sees it',
        'button:has-text("Who sees it")',
      ],
    },

    details: {
      internalName: [
        'input[name="internalName"]',
        'input[name="internal_name"]',
        'input[placeholder*="Internal name"]',
        'input[aria-label="Internal name"]',
      ],
      englishName: [
        'input[name="englishName"]',
        'input[name="english_name"]',
        'input[placeholder*="English name"]',
      ],
      spanishName: [
        'input[name="spanishName"]',
        'input[name="spanish_name"]',
        'input[placeholder*="Spanish name"]',
      ],
      active: [
        'input[name="active"]',
        '[data-testid="screen-active"]',
        '[aria-label="Boxes can be given this screen"]',
      ],
      default: [
        'input[name="default"]',
        'input[name="isDefault"]',
        '[data-testid="screen-default"]',
        '[aria-label="Everyone not matched by another screen"]',
      ],
    },

    look: {
      darkMode: [
        'input[value="dark"]',
        '[data-testid="mode-dark"]',
        'button[aria-label="Dark"]',
      ],
      lightMode: [
        'input[value="light"]',
        '[data-testid="mode-light"]',
        'button[aria-label="Light"]',
      ],
      accentColor: (color: string) => [
        `[data-color="${color}"]`,
        `[title="${color}"]`,
        `[aria-label="${color}"]`,
        `button[style*="${color}"]`,
      ],
    },

    background: {
      colorType: [
        'input[value="colour"]',
        'input[value="color"]',
        '[data-testid="background-colour"]',
      ],
      imageType: [
        'input[value="image"]',
        '[data-testid="background-image"]',
      ],
      colorPicker: [
        'input[type="color"]',
        'input[name="backgroundColor"]',
      ],
    },

    deviceTypes: {
      container: [
        '[data-testid="device-types"]',
        '.device-types',
      ],
      tvBox: [
        'input[value="TV Box"]',
        'input[name="deviceTypes"][value="TV Box"]',
        'label:has-text("TV Box")',
      ],
      tvApp: [
        'input[value="TV App"]',
        'input[name="deviceTypes"][value="TV App"]',
        'label:has-text("TV App")',
      ],
      mobile: [
        'input[value="Mobile"]',
        'input[name="deviceTypes"][value="Mobile"]',
        'label:has-text("Mobile")',
      ],
    },

    audience: {
      accountGroups: [
        '[data-testid="account-groups"]',
        '.account-groups',
      ],
      deviceFilter: [
        'select[name="deviceFilter"]',
        '[data-testid="device-filter"]',
        '[aria-label*="Device multi-filter"]',
      ],
    },

    footer: {
      save: [
        'button:has-text("Save screen")',
        'button[type="submit"]',
      ],
      discard: [
        'button:has-text("Discard changes")',
        'button:has-text("Discard")',
      ],
    },
  },

  listing: {
    table: [
      '[data-testid="screens-table"]',
      'table',
    ],
    rows: 'tbody tr',
    screenName: [
      '[data-testid="screen-name"]',
      '.screen-name',
    ],
    status: [
      '[data-testid="screen-status"]',
      '.status',
    ],
    shownTo: [
      '[data-testid="screen-audience"]',
      '.screen-audience',
    ],
    visibleRows: [
      '[data-testid="visible-rows"]',
      '.visible-rows',
    ],
    edit: [
      'button[aria-label="Edit"]',
      'button[title="Edit"]',
      '[data-testid="edit-screen"]',
      'button:has(svg)',
    ],
    clone: [
      'button[aria-label="Clone"]',
      'button[title="Clone"]',
      'button[aria-label="Copy"]',
      'button[title="Copy"]',
      '[data-testid="clone-screen"]',
    ],
    delete: [
      'button[aria-label="Delete"]',
      'button[title="Delete"]',
      '[data-testid="delete-screen"]',
    ],
  },

  confirmation: {
    dialog: [
      '[role="alertdialog"]',
      '[role="dialog"]',
      '.confirmation-dialog',
    ],
    confirm: [
      'button:has-text("Delete")',
      'button:has-text("Confirm")',
      'button:has-text("Yes")',
    ],
  },

  subscriberTool: {
    section: [
      'text=Subscriber account',
      '[data-testid="subscriber-testing-tool"]',
    ],
  },

  notifications: {
    success: [
      '[role="alert"]',
      '.toast-success',
      '.notification-success',
    ],
  },
} as const;
