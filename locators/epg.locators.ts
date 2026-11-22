
import { Locator, Page } from '@playwright/test';

export type EpgFilterTab =
  | 'All'
  | 'Published'
  | 'Expired'
  | 'Draft'
  | 'Hidden';

export class EpgLocators {
  readonly page: Page;

  // Main EPG grid
  readonly sourcesTable: Locator;
  readonly searchInput: Locator;
  readonly addSourceButton: Locator;

  // Filter tabs
  readonly allTab: Locator;
  readonly publishedTab: Locator;
  readonly expiredTab: Locator;
  readonly draftTab: Locator;
  readonly hiddenTab: Locator;

  // Add source panel
  readonly sourcePanel: Locator;
  readonly urlTab: Locator;
  readonly uploadTab: Locator;

  // URL form
  readonly xmltvUrlInput: Locator;
  readonly prefixInput: Locator;
  readonly initialStateSelect: Locator;

  // Form buttons
  readonly submitSourceButton: Locator;
  readonly cancelButton: Locator;

  // Language selection
  readonly languageCheckboxes: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main sources table
    this.sourcesTable = page.locator(
      'table:has(th), [role="grid"], table'
    ).filter({
      has: page.getByText(/prefix|xmltv|source/i),
    }).first();

    // Search input
    this.searchInput = page.locator(
      'input[placeholder*="Filter by prefix"]'
    ).first();

    // Add source button in page toolbar
    this.addSourceButton = page.getByRole('button', {
      name: /^Add source$/i,
    }).first();

    // Filter tabs
    this.allTab = page.getByRole('tab', {
      name: /^All$/i,
    }).or(
      page.getByRole('button', { name: /^All$/i })
    ).first();

    this.publishedTab = page.getByRole('tab', {
      name: /^Published$/i,
    }).or(
      page.getByRole('button', { name: /^Published$/i })
    ).first();

    this.expiredTab = page.getByRole('tab', {
      name: /^Expired$/i,
    }).or(
      page.getByRole('button', { name: /^Expired$/i })
    ).first();

    this.draftTab = page.getByRole('tab', {
      name: /^Draft$/i,
    }).or(
      page.getByRole('button', { name: /^Draft$/i })
    ).first();

    this.hiddenTab = page.getByRole('tab', {
      name: /^Hidden$/i,
    }).or(
      page.getByRole('button', { name: /^Hidden$/i })
    ).first();

    // Source editor panel
    this.sourcePanel = page.locator(
      '[role="dialog"]:visible, ' +
      '[role="complementary"]:visible, ' +
      'aside:visible, ' +
      '.sidebar:visible, ' +
      '.offcanvas:visible'
    ).last();

    // URL / Upload tabs
    this.urlTab = page.getByRole('tab', {
      name: /^URL$/i,
    }).or(
      page.getByText(/^URL$/i, { exact: true })
    ).first();

    this.uploadTab = page.getByRole('tab', {
      name: /^Upload$/i,
    }).or(
      page.getByText(/^Upload$/i, { exact: true })
    ).first();

    // XMLTV URL
    this.xmltvUrlInput = page.locator(
      'input[name="XmltvUrl"], ' +
      'input[placeholder$=".xml"], ' +
      'input[placeholder*=".xml"]'
    ).first();

    // Prefix
    this.prefixInput = page.locator(
      'input[name="Prefix"], input[name="prefix"]'
    ).first();

    // Initial state
    this.initialStateSelect = page.locator(
      'select[name="InitialState"], ' +
      'select[name="initialState"], ' +
      'select[name="State"]'
    ).first();

    // Language checkboxes
    this.languageCheckboxes = page.locator(
      'input[type="checkbox"]'
    );

    // Submit button scoped to source panel when possible
    this.submitSourceButton = page.getByRole('button', {
      name: /^Add source$/i,
    }).last();

    this.cancelButton = page.getByRole('button', {
      name: /^Cancel$/i,
    }).last();
  }

  /**
   * Returns the requested filter tab.
   */
  filterTab(tab: EpgFilterTab): Locator {
    const tabs: Record<EpgFilterTab, Locator> = {
      All: this.allTab,
      Published: this.publishedTab,
      Expired: this.expiredTab,
      Draft: this.draftTab,
      Hidden: this.hiddenTab,
    };

    return tabs[tab];
  }

  /**
   * Locate a source row by prefix.
   */
  rowByPrefix(prefix: string): Locator {
    return this.sourcesTable
      .locator('tbody tr, [role="row"]')
      .filter({
        hasText: prefix,
      })
      .filter({
        has: this.page.getByText(prefix, {
          exact: true,
        }),
      });
  }

  /**
   * Locate a source row by URL.
   */
  rowByUrl(url: string): Locator {
    return this.sourcesTable
      .locator('tbody tr, [role="row"]')
      .filter({
        hasText: url,
      });
  }

  /**
   * Locate an action inside a specific source row.
   */
  rowAction(
    prefix: string,
    action: 'View' | 'Edit prefix' | 'Edit state' | 'Check now' | 'Remove'
  ): Locator {
    const row = this.rowByPrefix(prefix);

    return row.getByRole('button', {
      name: new RegExp(`^${action}$`, 'i'),
    }).or(
      row.getByRole('link', {
        name: new RegExp(`^${action}$`, 'i'),
      })
    ).or(
      row.getByText(action, {
        exact: true,
      })
    ).first();
  }

  /**
   * Locate a save/update button in an editor.
   */
  getEditorSaveButton(): Locator {
    return this.page.getByRole('button', {
      name: /^(Save|Update|Apply)$/i,
    }).last();
  }

  /**
   * Locate a confirmation button in a visible dialog.
   */
  getConfirmationButton(): Locator {
    return this.page.locator(
      '[role="dialog"]:visible'
    ).getByRole('button', {
      name: /^(Yes|Confirm|Remove|Delete)$/i,
    }).last();
  }
}
