
export const StreamingServerSelectors = {
  page: {
    heading: 'h1:has-text("Streaming Servers"), h2:has-text("Streaming Servers")',
    addButton: 'button:has-text("Add server"), a:has-text("Add server")',
  },

  metrics: {
    onlineServers: 'text=Online servers',
    clientsWatching: 'text=Clients watching',
    liveStreamsPublishing: 'text=Live streams publishing',
    needAttention: 'text=Need attention',
  },

  table: {
    root: 'table',
    rows: 'tbody tr',
    emptyState: 'text=No streaming servers',
  },

  modal: {
    root: '[role="dialog"], .modal.show',

    // General
    title: 'input[name="title"], input[placeholder*="title" i]',
    host: 'input[name="host"], input[placeholder*="host" i]',
    role: 'select[name="role"], select[name*="role" i]',
    maximumUsers:
      'input[name="maximumUsers"], input[name*="max" i]',

    // Location
    country: 'input[name="country"], input[placeholder*="country" i]',
    latitude: 'input[name="latitude"], input[name="lat" i]',
    longitude: 'input[name="longitude"], input[name="long" i]',

    // Endpoints
    hlsBaseUrl:
      'input[name="hlsBaseUrl"], input[placeholder*="HLS" i]',
    statUrl:
      'input[name="statUrl"], input[placeholder*="Stat URL" i]',
    secureLinkSecret:
      'input[name="secureLinkSecret"], input[placeholder*="secret" i]',

    // Toggles
    enabled:
      'input[name="enabled"], [role="switch"][aria-label*="serve streams" i]',
    bindSignedUrls:
      'input[name="bindSignedUrls"], [role="switch"][aria-label*="viewer" i]',

    // Account groups
    accountGroups: {
      container:
        '[data-testid="account-groups"], .account-groups',
      karachi:
        'input[value="KARACHI"], label:has-text("KARACHI")',
      lahore:
        'input[value="LAHORE"], label:has-text("LAHORE")',
      islamabad:
        'input[value="ISLAMABAD"], label:has-text("ISLAMABAD")',
    },

    // Modal actions
    testButton: 'button:has-text("Test")',
    cancelButton: 'button:has-text("Cancel")',
    saveButton: 'button:has-text("Save")',
  },

  row: {
    title: 'td:nth-child(1)',
    host: 'td:nth-child(2)',
    region: 'td:nth-child(3)',
    groups: 'td:nth-child(4)',
    health: 'td:nth-child(5)',
    enabled: 'td:nth-child(6)',
    clients: 'td:nth-child(7)',
    streams: 'td:nth-child(8)',
    lastChecked: 'td:nth-child(9)',
  },

  rowActions: {
    secret:
      'button[aria-label*="secret" i], button[title*="secret" i]',
    edit:
      'button[aria-label*="edit" i], a[aria-label*="edit" i], button[title*="edit" i]',
    delete:
      'button[aria-label*="delete" i], a[aria-label*="delete" i], button[title*="delete" i]',
  },

  confirmation: {
    dialog: '[role="dialog"], .modal.show',
    confirm:
      'button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")',
    cancel:
      'button:has-text("Cancel"), button:has-text("No")',
  },

  notifications: {
    success:
      '[role="alert"], .toast-success, .alert-success',
  },
} as const;
