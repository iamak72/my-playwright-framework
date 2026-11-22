
import { expect, Locator, Page } from '@playwright/test';

import { BasePage } from './base.page';
import { TariffSelectors as S } from '../locators/tariff.selectors';

export type TariffService =
    | 'IPTV'
    | 'VoD'
    | 'Radio'
    | 'All categories';

export type ChannelScope =
    | 'Selected channels only'
    | 'All channels';

export interface TariffFormData {
    packageName: string;
    externalId: string;
    service: TariffService;
    channelScope: ChannelScope;
}

type SelectorList = readonly string[];

export class TariffsPage extends BasePage {
    private readonly modal: Locator;

    constructor(page: Page) {
        super(page);

        this.modal = page
            .locator(S.form.dialog.join(', '))
            .last();
    }

    /**
     * Returns the first visible element from the supplied selectors.
     */
    private async visibleLocator(
        parent: Page | Locator,
        selectors: SelectorList,
    ): Promise<Locator> {
        for (const selector of selectors) {
            const locator = parent.locator(selector).first();

            if (await locator.isVisible().catch(() => false)) {
                return locator;
            }
        }

        throw new Error(
            `No visible element found for selectors: ${selectors.join(', ')}`,
        );
    }

    /**
     * Returns a visible locator if one exists; otherwise null.
     */
    private async optionalVisibleLocator(
        parent: Page | Locator,
        selectors: SelectorList,
    ): Promise<Locator | null> {
        for (const selector of selectors) {
            const locator = parent.locator(selector).first();

            if (await locator.isVisible().catch(() => false)) {
                return locator;
            }
        }

        return null;
    }

    private async fillUsingSelectors(
        parent: Page | Locator,
        selectors: SelectorList,
        value: string,
    ): Promise<void> {
        const locator = await this.visibleLocator(
            parent,
            selectors,
        );

        await locator.fill(value);
    }

    private async clickUsingSelectors(
        parent: Page | Locator,
        selectors: SelectorList,
    ): Promise<void> {
        const locator = await this.visibleLocator(
            parent,
            selectors,
        );

        await locator.click();
    }

    // -----------------------------------------------------------------------
    // Navigation
    // -----------------------------------------------------------------------

    /**
     * Navigate to the Tariffs module through BasePage navigation.
     */
    async gotoTariffs(): Promise<void> {
        await this.navigateToModule(S.route);

        const addPackageButton = await this.visibleLocator(
            this.page,
            S.listing.addPackage,
        );

        await expect(addPackageButton).toBeVisible();
    }

    // -----------------------------------------------------------------------
    // Listing actions
    // -----------------------------------------------------------------------

    async openAddPackageForm(): Promise<void> {
        await this.clickUsingSelectors(
            this.page,
            S.listing.addPackage,
        );

        await expect(this.modal).toBeVisible();
    }

    private async getPackageRows(): Promise<Locator> {
        return this.page.locator(
            S.listing.rows.join(', '),
        );
    }

    async getPackageRow(identifier: string): Promise<Locator> {
        const rows = await this.getPackageRows();

        return rows.filter({
            hasText: identifier,
        }).first();
    }

    async searchPackage(searchText: string): Promise<void> {
        const search = await this.visibleLocator(
            this.page,
            S.listing.search,
        );

        await search.fill(searchText);

        await expect(search).toHaveValue(searchText);
    }

    async clearSearch(): Promise<void> {
        const search = await this.visibleLocator(
            this.page,
            S.listing.search,
        );

        await search.clear();

        await expect(search).toHaveValue('');
    }

    async verifyPackageVisible(identifier: string): Promise<void> {
        const row = await this.getPackageRow(identifier);

        await expect(row).toBeVisible();
    }

    async verifyPackageNotVisible(identifier: string): Promise<void> {
        const row = await this.getPackageRow(identifier);

        await expect(row).toHaveCount(0);
    }

    async isPackageVisible(identifier: string): Promise<boolean> {
        const row = await this.getPackageRow(identifier);

        return row.isVisible().catch(() => false);
    }

    // -----------------------------------------------------------------------
    // Form fields
    // -----------------------------------------------------------------------

    async fillPackageName(packageName: string): Promise<void> {
        await this.fillUsingSelectors(
            this.modal,
            S.form.packageName,
            packageName,
        );
    }

    async fillExternalId(externalId: string): Promise<void> {
        await this.fillUsingSelectors(
            this.modal,
            S.form.externalId,
            externalId,
        );
    }

    async selectService(service: TariffService): Promise<void> {
        const serviceSelectors: Record<
            TariffService,
            SelectorList
        > = {
            IPTV: S.services.iptv,
            VoD: S.services.vod,
            Radio: S.services.radio,
            'All categories': S.services.allCategories,
        };

        await this.clickUsingSelectors(
            this.modal,
            serviceSelectors[service],
        );
    }

    async selectChannelScope(scope: ChannelScope): Promise<void> {
        const scopeSelectors: Record<
            ChannelScope,
            SelectorList
        > = {
            'Selected channels only': S.channelScope.selectedOnly,
            'All channels': S.channelScope.allChannels,
        };

        const locator = await this.visibleLocator(
            this.modal,
            scopeSelectors[scope],
        );

        const tagName = await locator.evaluate(
            element => element.tagName.toLowerCase(),
        );

        if (tagName === 'input') {
            await locator.check();
        } else {
            await locator.click();
        }
    }

    async fillPackageForm(data: TariffFormData): Promise<void> {
        await this.fillPackageName(data.packageName);
        await this.fillExternalId(data.externalId);
        await this.selectService(data.service);
        await this.selectChannelScope(data.channelScope);
    }

    // -----------------------------------------------------------------------
    // Create
    // -----------------------------------------------------------------------

    async savePackage(): Promise<void> {
        await this.clickUsingSelectors(
            this.modal,
            S.form.save,
        );

        await expect(this.modal).toBeHidden({
            timeout: 15000,
        });
    }

    async createPackage(data: TariffFormData): Promise<void> {
        await this.openAddPackageForm();
        await this.fillPackageForm(data);
        await this.savePackage();
    }

    // -----------------------------------------------------------------------
    // Cancel / Close
    // -----------------------------------------------------------------------

    async cancelPackageForm(): Promise<void> {
        await this.clickUsingSelectors(
            this.modal,
            S.form.cancel,
        );

        await expect(this.modal).toBeHidden();
    }

    async closePackageForm(): Promise<void> {
        await this.clickUsingSelectors(
            this.modal,
            S.form.close,
        );

        await expect(this.modal).toBeHidden();
    }

    // -----------------------------------------------------------------------
    // Update
    // -----------------------------------------------------------------------

    async openEditPackage(identifier: string): Promise<void> {
        const row = await this.getPackageRow(identifier);

        await expect(row).toBeVisible();

        await this.clickUsingSelectors(
            row,
            S.rowActions.edit,
        );

        await expect(this.modal).toBeVisible();
    }

    async updatePackage(
        identifier: string,
        updates: Partial<TariffFormData>,
    ): Promise<void> {
        await this.openEditPackage(identifier);

        if (updates.packageName !== undefined) {
            await this.fillPackageName(updates.packageName);
        }

        if (updates.externalId !== undefined) {
            await this.fillExternalId(updates.externalId);
        }

        if (updates.service !== undefined) {
            await this.selectService(updates.service);
        }

        if (updates.channelScope !== undefined) {
            await this.selectChannelScope(updates.channelScope);
        }

        await this.savePackage();
    }

    // -----------------------------------------------------------------------
    // Delete
    // -----------------------------------------------------------------------

    async deletePackage(identifier: string): Promise<void> {
        const row = await this.getPackageRow(identifier);

        await expect(row).toBeVisible();

        await this.clickUsingSelectors(
            row,
            S.rowActions.delete,
        );

        const confirmation = await this.optionalVisibleLocator(
            this.page,
            S.confirmation.dialog,
        );

        if (confirmation) {
            await this.clickUsingSelectors(
                confirmation,
                S.confirmation.confirm,
            );
        }

        await expect(row).toHaveCount(0, {
            timeout: 15000,
        });
    }

    // -----------------------------------------------------------------------
    // Pagination
    // -----------------------------------------------------------------------

    async goToNextPage(): Promise<void> {
        const next = await this.visibleLocator(
            this.page,
            S.listing.nextPage,
        );

        await expect(next).toBeEnabled();

        await next.click();
    }

    async goToPreviousPage(): Promise<void> {
        const previous = await this.visibleLocator(
            this.page,
            S.listing.previousPage,
        );

        await expect(previous).toBeEnabled();

        await previous.click();
    }

    async setRowsPerPage(value: string): Promise<void> {
        const dropdown = await this.visibleLocator(
            this.page,
            S.listing.rowsPerPage,
        );

        await dropdown.selectOption(value);
    }

    // -----------------------------------------------------------------------
    // Feedback
    // -----------------------------------------------------------------------

    async verifySuccessMessage(): Promise<void> {
        const message = await this.visibleLocator(
            this.page,
            S.feedback.success,
        );

        await expect(message).toBeVisible();
    }

    getPackageModal(): Locator {
        return this.modal;
    }
}
