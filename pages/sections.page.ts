
import { Page, Locator, expect } from '@playwright/test';

import { BasePage } from './base.page';
import {
    SectionsLocators,
    getSectionRow,
} from '../locators/sections.locators';

export type SectionType = 'Static' | 'Dynamic' | 'Hybrid';

export type SectionPlacement =
    | 'Home'
    | 'Category page'
    | 'Mobile'
    | 'Web'
    | 'TV';

export interface SectionFormData {
    sectionName: string;
    internalName: string;
    type: SectionType;
    displayTitle?: string;
    order?: number;
    placements?: SectionPlacement[];
    active?: boolean;
    featured?: boolean;
}

export class SectionsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the Sections management page.
     */
    async gotoSections(): Promise<void> {
        await this.navigateTo('/sections');

        await this.page.locator(SectionsLocators.newSectionButton)
            .waitFor({
                state: 'visible',
                timeout: 15000,
            });
    }

    /**
     * Open the New section modal.
     */
    async clickNewSection(): Promise<void> {
        await this.page.locator(SectionsLocators.newSectionButton).click();

        await this.page.locator(SectionsLocators.sectionNameInput)
            .waitFor({
                state: 'visible',
                timeout: 10000,
            });
    }

    /**
     * Select a section type using its interactive button.
     */
    private async selectSectionType(type: SectionType): Promise<void> {
        const selectors: Record<SectionType, string> = {
            Static: SectionsLocators.staticTypeButton,
            Dynamic: SectionsLocators.dynamicTypeButton,
            Hybrid: SectionsLocators.hybridTypeButton,
        };

        const button = this.page.locator(selectors[type]).last();

        await button.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await button.click();
    }

    /**
     * Set a placement checkbox.
     */
    private async setPlacement(
        placement: SectionPlacement,
        checked: boolean
    ): Promise<void> {
        const selectors: Record<SectionPlacement, string> = {
            Home: SectionsLocators.placementHome,
            'Category page': SectionsLocators.placementCategoryPage,
            Mobile: SectionsLocators.placementMobile,
            Web: SectionsLocators.placementWeb,
            TV: SectionsLocators.placementTv,
        };

        const locator = this.page.locator(selectors[placement]).last();

        await locator.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const tagName = await locator.evaluate(
            element => element.tagName.toLowerCase()
        );

        if (tagName === 'input') {
            const checkbox = locator as Locator;
            if (checked) {
                await checkbox.check();
            } else {
                await checkbox.uncheck();
            }
            return;
        }

        const checkbox = locator.locator('input[type="checkbox"]');

        if (await checkbox.count() > 0) {
            if (checked) {
                await checkbox.check();
            } else {
                await checkbox.uncheck();
            }
            return;
        }

        // Clicking the associated label toggles its checkbox.
        await locator.click();
    }

    /**
     * Set a checkbox or switch to the requested state.
     */
    private async setToggle(
        selector: string,
        checked: boolean
    ): Promise<void> {
        const toggle = this.page.locator(selector).last();

        await toggle.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const tagName = await toggle.evaluate(
            element => element.tagName.toLowerCase()
        );

        if (tagName === 'input') {
            if (checked) {
                await toggle.check();
            } else {
                await toggle.uncheck();
            }
            return;
        }

        const currentState = await toggle.getAttribute('aria-checked');

        if (currentState !== null) {
            if ((currentState === 'true') !== checked) {
                await toggle.click();
            }
            return;
        }

        const checkbox = toggle.locator('input[type="checkbox"]');

        if (await checkbox.count() > 0) {
            if (checked) {
                await checkbox.check();
            } else {
                await checkbox.uncheck();
            }
            return;
        }

        await toggle.click();
    }

    /**
     * Fill the Basics tab and optional placement settings.
     */
    async fillSectionForm(data: SectionFormData): Promise<void> {
        const basicsTab = this.page.locator(SectionsLocators.basicsTab)
            .first();

        if (await basicsTab.isVisible().catch(() => false)) {
            await basicsTab.click();
        }

        await this.page.locator(SectionsLocators.sectionNameInput)
            .fill(data.sectionName);

        await this.page.locator(SectionsLocators.internalNameInput)
            .fill(data.internalName);

        await this.selectSectionType(data.type);

        if (data.displayTitle !== undefined) {
            await this.page.locator(SectionsLocators.displayTitleInput)
                .fill(data.displayTitle);
        }

        if (data.order !== undefined) {
            await this.page.locator(SectionsLocators.orderInput)
                .fill(String(data.order));
        }

        if (data.placements !== undefined) {
            for (const placement of data.placements) {
                await this.setPlacement(placement, true);
            }
        }

        if (data.active !== undefined) {
            await this.setToggle(
                SectionsLocators.activeToggle,
                data.active
            );
        }

        if (data.featured !== undefined) {
            await this.setToggle(
                SectionsLocators.featuredToggle,
                data.featured
            );
        }
    }

    /**
     * Save the section form.
     */
    async saveSection(): Promise<void> {
        const saveButton = this.page.locator(SectionsLocators.saveButton)
            .last();

        await saveButton.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await expect(saveButton).toBeEnabled();
        await saveButton.click();

        await expect(
            this.page.locator(SectionsLocators.sectionNameInput)
        ).toBeHidden({ timeout: 15000 });
    }

    /**
     * Search for a section by name or internal name.
     */
    async searchSection(searchTerm: string): Promise<void> {
        const searchInput = this.page.locator(
            SectionsLocators.searchInput
        );

        await searchInput.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await searchInput.fill(searchTerm);
    }

    /**
     * Check whether a section is visible in the table.
     */
    async isSectionPresent(sectionName: string): Promise<boolean> {
        return getSectionRow(this.page, sectionName)
            .isVisible()
            .catch(() => false);
    }

    /**
     * Open the edit form for a section.
     */
    async editSection(sectionName: string): Promise<void> {
        await this.searchSection(sectionName);

        const row = getSectionRow(this.page, sectionName);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const editButton = row.locator(
            SectionsLocators.editButton
        ).first();

        await editButton.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await editButton.click();

        await this.page.locator(SectionsLocators.sectionNameInput)
            .waitFor({
                state: 'visible',
                timeout: 10000,
            });
    }

    /**
     * Delete a section and confirm the action.
     */
    async deleteSection(sectionName: string): Promise<void> {
        await this.searchSection(sectionName);

        const row = getSectionRow(this.page, sectionName);

        await row.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const deleteButton = row.locator(
            SectionsLocators.deleteButton
        ).first();

        await deleteButton.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await deleteButton.click();

        const dialog = this.page.locator(
            SectionsLocators.confirmationDialog
        );

        if (await dialog.isVisible().catch(() => false)) {
            const confirmButton = dialog.locator(
                SectionsLocators.confirmDeleteButton
            ).first();

            await confirmButton.waitFor({
                state: 'visible',
                timeout: 5000,
            });

            await confirmButton.click();
        }

        await expect(row).toBeHidden({ timeout: 15000 });
    }
}
