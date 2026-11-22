
import { Page, Locator } from '@playwright/test';

export class ChannelsLocators {

    constructor(private readonly page: Page) {}

    // ==========================================
    // CHANNELS LISTING PAGE
    // ==========================================

    get addChannelButton(): Locator {
        return this.page.locator('a.ox-btn[href="/channel-editor"]');
    }

    get searchInput(): Locator {
        return this.page.locator('input[placeholder="Find by name"]');
    }

    get channelsTable(): Locator {
        return this.page.locator('table');
    }

    get tableHeaders(): Locator {
        return this.page.locator('table thead th');
    }

    get tableRows(): Locator {
        return this.page.locator('table tbody tr');
    }

    // ==========================================
    // CHANNEL EDITOR FORM
    // ==========================================

    get channelNumberInput(): Locator {
        return this.page.locator('#chNumber');
    }

    get channelNameInput(): Locator {
        return this.page.locator('#chName');
    }

    get channelStatusToggle(): Locator {
        return this.page.getByRole('switch');
    }

    get categoryDropdown(): Locator {
        return this.page.locator('#chCategory');
    }

    get languagesDropdown(): Locator {
        return this.page.locator('#chLangSelect');
    }

    get languagesHiddenInput(): Locator {
        return this.page.locator('input[name="Languages"]');
    }

    get volumeCorrectionDropdown(): Locator {
        return this.page.locator('#chVol');
    }

    // ==========================================
    // EDITOR NAVIGATION TABS
    // ==========================================

    get generalTab(): Locator {
        return this.page.getByText('General', { exact: true });
    }

    get streamingLinksTab(): Locator {
        return this.page.getByText('Streaming links', { exact: true });
    }

    get tvGuideTab(): Locator {
        return this.page.getByText('TV guide', { exact: true });
    }

    get restrictionsTab(): Locator {
        return this.page.getByText('Restrictions', { exact: true });
    }

    get accessTab(): Locator {
        return this.page.getByText('Access', { exact: true });
    }

    get visibilityTab(): Locator {
        return this.page.getByText('Visibility', { exact: true });
    }

    // ==========================================
    // FORM ACTIONS
    // ==========================================

    get saveChannelButton(): Locator {
        return this.page.locator('#ch_save');
    }

    get cancelButton(): Locator {
        return this.page.getByRole('button', {
            name: 'Cancel',
            exact: true
        });
    }

    // ==========================================
    // TABLE ROW ACTIONS
    // ==========================================

    getChannelRow(channelName: string): Locator {
        return this.tableRows.filter({
            hasText: channelName
        });
    }

    getEditButton(row: Locator): Locator {
        return row.locator(
            'button[aria-label="Edit"], a[aria-label="Edit"]'
        );
    }

    getDeleteButton(row: Locator): Locator {
        return row.locator(
            'button[aria-label="Delete"], a[aria-label="Delete"]'
        );
    }

    getRowStatusToggle(row: Locator): Locator {
        return row.getByRole('switch');
    }

    // ==========================================
    // DELETE CONFIRMATION
    // ==========================================

    get confirmationDialog(): Locator {
        return this.page.getByRole('dialog');
    }

    get confirmDeleteButton(): Locator {
        return this.confirmationDialog.getByRole('button', {
            name: 'Delete',
            exact: true
        });
    }
}
