
export const AccountSelectors = {
  route: '/subscribers',

  listing: {
    addAccount: [
      'button:has-text("Add account")',
      'button:has-text("Add Account")',
      '[data-testid="add-account"]',
    ],
    search: [
      'input[placeholder*="Search by account"]',
      'input[placeholder*="Search"]',
      'input[aria-label*="Search"]',
      '[data-testid="accounts-search"]',
    ],
    rows: [
      '[data-testid="account-row"]',
      'table tbody tr',
      '[role="row"]',
    ],
    emptyState: [
      '[data-testid="empty-state"]',
      '.empty-state',
      '.no-data',
    ],
  },

  modal: {
    root: [
      '[role="dialog"]',
      '.modal.show',
      '.modal[open]',
      '[data-testid="account-modal"]',
    ],
    close: [
      'button[aria-label="Close"]',
      'button[title="Close"]',
      '.modal .btn-close',
      '.modal button.close',
      '[data-testid="modal-close"]',
    ],
    discard: [
      'button:has-text("Discard")',
      '[data-testid="discard-account"]',
    ],
    create: [
      'button:has-text("Create account")',
      'button:has-text("Create Account")',
      '[data-testid="create-account"]',
    ],
    save: [
      'button:has-text("Save changes")',
      'button:has-text("Save account")',
      'button:has-text("Update account")',
      '[data-testid="save-account"]',
    ],
  },

  fields: {
    username: [
      'input[name="Username"]',
      'input[name="username"]',
      '#Username',
      'input[placeholder="Username"]',
    ],
    password: [
      'input[name="Password"]',
      'input[name="password"]',
      '#Password',
    ],
    group: [
      'select[name="Group"]',
      'select[name="group"]',
      '#Group',
      '[data-testid="account-group"]',
    ],
    tariffPlan: [
      'select[name="TariffPlan"]',
      'select[name="Tariff"]',
      'select[name="tariffPlan"]',
      '#TariffPlan',
      '[data-testid="account-tariff"]',
    ],
    balance: [
      'input[name="Balance"]',
      'input[name="balance"]',
      '#Balance',
    ],
    externalId: [
      'input[name="ExternalId"]',
      'input[name="ExternalID"]',
      'input[name="externalId"]',
      '#ExternalId',
    ],
    firstName: [
      'input[name="FirstName"]',
      'input[name="firstName"]',
      '#FirstName',
    ],
    middleName: [
      'input[name="MiddleName"]',
      'input[name="middleName"]',
      '#MiddleName',
    ],
    lastName: [
      'input[name="LastName"]',
      'input[name="lastName"]',
      '#LastName',
    ],
    phone: [
      'input[name="Phone"]',
      'input[name="phone"]',
      '#Phone',
    ],
    authPhone: [
      'input[name="AuthPhone"]',
      'input[name="authPhone"]',
      '#AuthPhone',
    ],
    email: [
      'input[name="Email"]',
      'input[name="email"]',
      '#Email',
      'input[type="email"]',
    ],
    city: [
      'input[name="City"]',
      'input[name="city"]',
      '#City',
    ],
    parentPin: [
      'input[name="ParentPin"]',
      'input[name="ParentPIN"]',
      '#ParentPin',
    ],
    masterPin: [
      'input[name="MasterPin"]',
      'input[name="MasterPIN"]',
      '#MasterPin',
    ],
    deviceServices: [
      'input[name="DeviceServices"]',
      'input[name="deviceServices"]',
      '#DeviceServices',
    ],
    appServices: [
      'input[name="AppServices"]',
      'input[name="AppServicesLimit"]',
      'input[name="appServices"]',
      '#AppServices',
    ],
    comments: [
      'textarea[name="Comments"]',
      'textarea[name="comments"]',
      '#Comments',
    ],
  },

  status: {
    input: [
      'input[name="IsActive"]',
      'input[name="Active"]',
      'input[name="isActive"]',
      '[data-testid="account-status"] input',
    ],
    toggle: [
      '[data-testid="account-status"]',
      'label:has(input[name="IsActive"])',
      'label:has(input[name="Active"])',
      '.form-switch',
    ],
  },

  validation: {
    errors: [
      '[role="alert"]',
      '.invalid-feedback',
      '.field-validation-error',
      '.validation-error',
      '[data-testid="validation-error"]',
    ],
    duplicateUsername: [
      'text=Username already exists',
      'text=Username already taken',
      'text=already exists',
      'text=already taken',
    ],
    invalidEmail: [
      'text=Invalid email',
      'text=Enter a valid email',
      'text=Please enter a valid email',
    ],
  },

  rowActions: {
    edit: [
      'button[aria-label="Edit"]',
      'button[title="Edit"]',
      'a[title="Edit"]',
      '[data-testid="edit-account"]',
    ],
    delete: [
      'button[aria-label="Delete"]',
      'button[title="Delete"]',
      'a[title="Delete"]',
      '[data-testid="delete-account"]',
    ],
    status: [
      '[data-testid="row-status-toggle"]',
      'input[type="checkbox"]',
      'button[aria-label*="status"]',
    ],
    confirmDelete: [
      'button:has-text("Delete")',
      'button:has-text("Confirm")',
      '[data-testid="confirm-delete"]',
    ],
    cancelDelete: [
      'button:has-text("Cancel")',
      '[data-testid="cancel-delete"]',
    ],
  },
} as const;
