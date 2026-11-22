
export const StorageSelectors = {
  page: {
    heading: 'h1:has-text("Storage"), h2:has-text("Storage")',
    addButton: 'button:has-text("Add storage"), a:has-text("Add storage")',
    search: 'input[placeholder*="search" i]',
  },

  metrics: {
    volumes: 'text=Volumes',
    viewerCapacity: 'text=Viewer capacity',
    recordingAllowed: 'text=Recording allowed',
  },

  filters: {
    kind: 'button:has-text("Kind"), [role="tab"]:has-text("Kind")',
    recording: 'button:has-text("Recording"), [role="tab"]:has-text("Recording")',
  },

  table: {
    root: 'table',
    rows: 'tbody tr',
    emptyState: 'text=No storage',
  },

  modal: {
    root: '[role="dialog"], .modal.show, .modal[style*="display: block"]',

    title: 'input[name="title"], input[placeholder*="title" i]',
    kind: 'select[name="kind"], select[name*="type" i]',
    folderPath: 'input[name="folderPath"], input[placeholder*="folder" i], input[placeholder*="path" i]',

    status: 'input[name="status"], input[name="active"], [role="switch"]',

    useFor: {
      sourceFiles: 'input[value="Source files"], label:has-text("Source files")',
      streamOutput: 'input[value="Stream output"], label:has-text("Stream output")',
    },

    playbackUrlBase:
      'input[name="playbackUrlBase"], input[placeholder*="Playback URL" i]',

    maximumUsers:
      'input[name="maximumUsers"], input[name*="max" i]',

    recording:
      'select[name="recording"], select[name*="record" i]',

    testConnection:
      'button:has-text("Test connection")',

    save: 'button:has-text("Save")',
    cancel: 'button:has-text("Cancel")',
  },

  rowActions: {
    edit: 'button[aria-label*="edit" i], a[aria-label*="edit" i], button:has-text("Edit")',
    delete: 'button[aria-label*="delete" i], a[aria-label*="delete" i], button:has-text("Delete")',
  },

  confirmation: {
    dialog: '[role="dialog"], .modal.show',
    confirm:
      'button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")',
    cancel: 'button:has-text("Cancel"), button:has-text("No")',
  },

  notifications: {
    success:
      '[role="alert"]:has-text("success"), .toast-success, .alert-success',
  },

  unreferencedUploads: {
    section: 'text=Unreferenced uploads',
  },
} as const;
