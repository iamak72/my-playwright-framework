
export const AdsSelectors = {
  page: {
    heading: 'Ads & AVOD',
  },

  navigation: {
    advertisements: [
      '[data-testid="advertisements-tab"]',
      '[role="tab"]:has-text("Advertisements")',
      'text=Advertisements',
    ],
    campaigns: [
      '[data-testid="avod-campaigns-tab"]',
      '[role="tab"]:has-text("AVOD Campaigns")',
      'text=AVOD Campaigns',
    ],
  },

  metrics: {
    total: '[data-testid="ads-total"]',
    published: '[data-testid="ads-published"]',
    scheduled: '[data-testid="ads-scheduled"]',
    expired: '[data-testid="ads-expired"]',
    impressions: '[data-testid="ads-impressions"]',
    runningCampaigns: '[data-testid="running-campaigns"]',
    budget: '[data-testid="campaign-budget"]',
  },

  advertisements: {
    addButton: [
      '[data-testid="new-advertisement"]',
      'button:has-text("+ New advertisement")',
      'button:has-text("New advertisement")',
    ],
    search: [
      '[data-testid="advertisement-search"]',
      'input[placeholder="Heading or description"]',
      'input[placeholder="Search advertisements"]',
    ],
    table: [
      '[data-testid="advertisements-table"]',
      'table',
    ],
    rows: 'tbody tr',

    modal: {
      root: [
        '[data-testid="advertisement-modal"]',
        '[role="dialog"]',
        '.modal.show',
        '.modal[open]',
      ],
      type: [
        '[data-testid="ad-type"]',
        'select[name="type"]',
        '[name="type"]',
      ],
      heading: [
        '[data-testid="ad-heading"]',
        'input[name="heading"]',
        'input[placeholder="Heading"]',
      ],
      campaign: [
        '[data-testid="ad-campaign"]',
        'select[name="campaign"]',
        '[name="campaignId"]',
      ],
      description: [
        '[data-testid="ad-description"]',
        'textarea[name="description"]',
        'textarea[placeholder="Description"]',
      ],
      platforms: {
        mobile: [
          '[data-testid="platform-mobile"]',
          'input[name="platforms"][value="Mobile"]',
        ],
        tv: [
          '[data-testid="platform-tv"]',
          'input[name="platforms"][value="TV"]',
        ],
        tvLauncher: [
          '[data-testid="platform-tv-launcher"]',
          'input[name="platforms"][value="TV Launcher"]',
        ],
        web: [
          '[data-testid="platform-web"]',
          'input[name="platforms"][value="Web"]',
        ],
        all: [
          '[data-testid="platform-all"]',
          'input[name="platforms"][value="All"]',
        ],
      },
      frequency: {
        hourly: [
          '[data-testid="frequency-hourly"]',
          'input[name="frequency"][value="Hourly"]',
        ],
        daily: [
          '[data-testid="frequency-daily"]',
          'input[name="frequency"][value="Daily"]',
        ],
        weekly: [
          '[data-testid="frequency-weekly"]',
          'input[name="frequency"][value="Weekly"]',
        ],
      },
      targetAudience: [
        '[data-testid="target-audience"]',
        'input[name="targetAudience"]',
        'input[placeholder="Target audience"]',
      ],
      priority: [
        '[data-testid="display-priority"]',
        'input[name="priority"]',
        'input[type="number"]',
      ],
      save: [
        '[data-testid="save-advertisement"]',
        'button:has-text("Create")',
        'button:has-text("Save")',
      ],
      cancel: [
        '[data-testid="cancel-advertisement"]',
        'button:has-text("Cancel")',
      ],
      close: [
        '[data-testid="close-advertisement"]',
        'button[aria-label="Close"]',
      ],
    },

    rowActions: {
      edit: [
        '[data-testid="edit-advertisement"]',
        'button[aria-label="Edit"]',
        'button[title="Edit"]',
      ],
      delete: [
        '[data-testid="delete-advertisement"]',
        'button[aria-label="Delete"]',
        'button[title="Delete"]',
      ],
    },
  },

  campaigns: {
    addButton: [
      '[data-testid="new-campaign"]',
      'button:has-text("+ New campaign")',
      'button:has-text("New campaign")',
    ],
    search: [
      '[data-testid="campaign-search"]',
      'input[placeholder="Search campaigns"]',
      'input[placeholder="Search"]',
    ],
    table: [
      '[data-testid="avod-campaigns-table"]',
      'table',
    ],
    rows: 'tbody tr',

    modal: {
      root: [
        '[data-testid="campaign-modal"]',
        '[role="dialog"]',
        '.modal.show',
        '.modal[open]',
      ],
      name: [
        '[data-testid="campaign-name"]',
        'input[name="name"]',
        'input[name="campaignName"]',
        'input[placeholder="Campaign name"]',
      ],
      type: [
        '[data-testid="campaign-type"]',
        'select[name="type"]',
        '[name="campaignType"]',
      ],
      duration: [
        '[data-testid="campaign-duration"]',
        'select[name="duration"]',
        '[name="duration"]',
      ],
      budget: [
        '[data-testid="campaign-budget-input"]',
        'input[name="budget"]',
        'input[placeholder="Budget"]',
      ],
      status: [
        '[data-testid="campaign-status"]',
        'select[name="status"]',
        '[name="status"]',
      ],
      save: [
        '[data-testid="save-campaign"]',
        'button:has-text("Create")',
        'button:has-text("Save")',
      ],
      cancel: [
        '[data-testid="cancel-campaign"]',
        'button:has-text("Cancel")',
      ],
      close: [
        '[data-testid="close-campaign"]',
        'button[aria-label="Close"]',
      ],
    },

    rowActions: {
      edit: [
        '[data-testid="edit-campaign"]',
        'button[aria-label="Edit"]',
        'button[title="Edit"]',
      ],
      delete: [
        '[data-testid="delete-campaign"]',
        'button[aria-label="Delete"]',
        'button[title="Delete"]',
      ],
    },
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

// Form value types
export type AdvertisementType = 'Advertisement' | 'Notification';

export type TargetPlatform =
  | 'Mobile'
  | 'TV'
  | 'TV Launcher'
  | 'Web'
  | 'All';

export type DisplayFrequency = 'Hourly' | 'Daily' | 'Weekly';

export type CampaignType = 'Pre-roll' | 'Sponsorship';

export type CampaignDuration = '5s' | '15s' | '60s';

export type CampaignStatus = 'Active' | 'Paused' | 'Completed';
