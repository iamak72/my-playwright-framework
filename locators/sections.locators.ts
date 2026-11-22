
import { Page } from '@playwright/test';

export const SectionsLocators = {
    // Sections listing
    table: 'table, [role="grid"]',
    tableRows: 'tbody tr, [role="row"]',
    searchInput: 'input[placeholder*="Name or internal name"]',

    // Section type filter tabs
    anyTab: 'button:has-text("Any")',
    staticTab: 'button:has-text("Static")',
    dynamicTab: 'button:has-text("Dynamic")',
    hybridTab: 'button:has-text("Hybrid")',

    statusDropdown: 'select[name="status"], [aria-label="Status"]',

    newSectionButton: 'button:has-text("New section")',

    // Modal
    dialog: '[role="dialog"]',
    basicsTab: 'button:has-text("Basics"), [role="tab"]:has-text("Basics")',
    filtersTab: 'button:has-text("Filters"), [role="tab"]:has-text("Filters")',

    // Basic fields
    sectionNameInput:
        'input[name="SectionName"], input[name="sectionName"]',
    internalNameInput:
        'input[name="InternalName"], input[name="internalName"]',
    displayTitleInput:
        'input[name="DisplayTitle"], input[name="displayTitle"]',
    orderInput:
        'input[name="Order"], input[name="order"], input[type="number"]',

    // Section type buttons
    staticTypeButton: 'button:has-text("Static")',
    dynamicTypeButton: 'button:has-text("Dynamic")',
    hybridTypeButton: 'button:has-text("Hybrid")',

    // Placement checkboxes
    placementHome: 'input[type="checkbox"][name*="Home"], label:has-text("Home")',
    placementCategoryPage:
        'input[type="checkbox"][name*="Category"], label:has-text("Category page")',
    placementMobile:
        'input[type="checkbox"][name*="Mobile"], label:has-text("Mobile")',
    placementWeb:
        'input[type="checkbox"][name*="Web"], label:has-text("Web")',
    placementTv:
        'input[type="checkbox"][name*="TV"], label:has-text("TV")',

    // Toggles
    activeToggle:
        'input[type="checkbox"][name="Active"], [role="switch"][aria-label="Active"]',
    featuredToggle:
        'input[type="checkbox"][name="Featured"], [role="switch"][aria-label="Featured"]',

    // Form buttons
    cancelButton: 'button:has-text("Cancel")',
    saveButton: 'button:has-text("Save section")',

    // Row actions
    editButton: 'button[aria-label="Edit"], button:has-text("Edit")',
    viewButton: 'button[aria-label="View"], button:has-text("View")',
    deleteButton: [
        'button[aria-label="Delete"]',
        'button[aria-label="Trash"]',
        'button[title="Delete"]',
        'button[title="Move to trash"]',
        'button:has-text("Delete")',
    ].join(', '),

    // Delete confirmation
    confirmationDialog: '[role="dialog"]',
    confirmDeleteButton: [
        '[role="dialog"] button:has-text("Delete")',
        '[role="dialog"] button:has-text("Confirm")',
        '[role="dialog"] button:has-text("Yes")',
        '[role="dialog"] button:has-text("Move to trash")',
    ].join(', '),
} as const;

/**
 * Locate the table row containing a section name.
 */
export function getSectionRow(page: Page, sectionName: string) {
    return page.locator(SectionsLocators.tableRows)
        .filter({ hasText: sectionName })
        .first();
}
