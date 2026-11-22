
import {
    expect,
    Locator,
    Page,
} from '@playwright/test';

import { BasePage } from './base.page';

import {
    GenreSelectors as S,
    GenreCategory,
} from '../locators/genre.selectors';

export interface GenreFormData {
    name: string;
    english?: string;
    spanish?: string;
    categories: GenreCategory[];
    ageRestricted: boolean;
}

export class GenresPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    /**
     * Returns the first visible locator from a selector list.
     */
    private async getVisibleLocator(
        parent: Locator,
        selectors: readonly string[],
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
     * Returns the first visible locator on the page.
     */
    private async getPageVisibleLocator(
        selectors: readonly string[],
    ): Promise<Locator> {
        return this.getVisibleLocator(this.page.locator('body'), selectors);
    }

    /**
     * Returns the currently visible genre modal.
     */
    private async getModal(): Promise<Locator> {
        for (const selector of S.modal.root) {
            const locator = this.page.locator(selector).last();

            if (await locator.isVisible().catch(() => false)) {
                return locator;
            }
        }

        throw new Error('Genre modal is not visible.');
    }

    // -------------------------------------------------------
    // Navigation
    // -------------------------------------------------------

    async gotoGenres(): Promise<void> {
        await this.navigateToModule(S.route);

        await expect(
            await this.getPageVisibleLocator(S.listing.addGenre),
        ).toBeVisible();
    }

    // -------------------------------------------------------
    // Listing actions
    // -------------------------------------------------------

    async openAddGenreModal(): Promise<void> {
        const addButton = await this.getPageVisibleLocator(
            S.listing.addGenre,
        );

        await addButton.click();

        await expect(await this.getModal()).toBeVisible();
    }

    async searchGenre(name: string): Promise<void> {
        const searchInput = await this.getPageVisibleLocator(
            S.listing.search,
        );

        await searchInput.fill(name);

        await expect(searchInput).toHaveValue(name);
    }

    async clearSearch(): Promise<void> {
        const searchInput = await this.getPageVisibleLocator(
            S.listing.search,
        );

        await searchInput.clear();
    }

    getGenreRows(): Locator {
        return this.page.locator(S.listing.rows.join(', '));
    }

    async getGenreRow(name: string): Promise<Locator> {
        const row = this.getGenreRows()
            .filter({ hasText: name })
            .first();

        await expect(row).toBeVisible();

        return row;
    }

    async verifyGenreVisible(name: string): Promise<void> {
        await expect(
            this.getGenreRows().filter({ hasText: name }).first(),
        ).toBeVisible();
    }

    async verifyGenreNotVisible(name: string): Promise<void> {
        await expect(
            this.getGenreRows().filter({ hasText: name }),
        ).toHaveCount(0);
    }

    // -------------------------------------------------------
    // Form actions
    // -------------------------------------------------------

    async fillGenreName(name: string): Promise<void> {
        const modal = await this.getModal();

        const input = await this.getVisibleLocator(
            modal,
            S.modal.name,
        );

        await input.fill(name);
    }

    async fillEnglishTranslation(value: string): Promise<void> {
        const modal = await this.getModal();

        const input = await this.getVisibleLocator(
            modal,
            S.modal.english,
        );

        await input.fill(value);
    }

    async fillSpanishTranslation(value: string): Promise<void> {
        const modal = await this.getModal();

        const input = await this.getVisibleLocator(
            modal,
            S.modal.spanish,
        );

        await input.fill(value);
    }

    async setCategory(
        category: GenreCategory,
        checked: boolean,
    ): Promise<void> {
        const modal = await this.getModal();

        const checkbox = await this.getVisibleLocator(
            modal,
            S.modal.categories[category],
        );

        await checkbox.setChecked(checked);

        await expect(checkbox).toBeChecked({
            checked,
        });
    }

    async setCategories(
        categories: GenreCategory[],
    ): Promise<void> {
        const allCategories = Object.keys(
            S.modal.categories,
        ) as GenreCategory[];

        for (const category of allCategories) {
            await this.setCategory(
                category,
                categories.includes(category),
            );
        }
    }

    async setAgeRestricted(enabled: boolean): Promise<void> {
        const modal = await this.getModal();

        const checkbox = await this.getVisibleLocator(
            modal,
            S.modal.ageRestricted,
        );

        await checkbox.setChecked(enabled);

        await expect(checkbox).toBeChecked({
            checked: enabled,
        });
    }

    async fillGenreForm(data: GenreFormData): Promise<void> {
        await this.fillGenreName(data.name);

        if (data.english !== undefined) {
            await this.fillEnglishTranslation(data.english);
        }

        if (data.spanish !== undefined) {
            await this.fillSpanishTranslation(data.spanish);
        }

        await this.setCategories(data.categories);
        await this.setAgeRestricted(data.ageRestricted);
    }

    async saveGenre(): Promise<void> {
        const modal = await this.getModal();

        const saveButton = await this.getVisibleLocator(
            modal,
            S.modal.save,
        );

        await saveButton.click();

        await expect(modal).toBeHidden();
    }

    async cancelGenre(): Promise<void> {
        const modal = await this.getModal();

        const cancelButton = await this.getVisibleLocator(
            modal,
            S.modal.cancel,
        );

        await cancelButton.click();

        await expect(modal).toBeHidden();
    }

    async closeGenreModal(): Promise<void> {
        const modal = await this.getModal();

        const closeButton = await this.getVisibleLocator(
            modal,
            S.modal.close,
        );

        await closeButton.click();

        await expect(modal).toBeHidden();
    }

    async createGenre(data: GenreFormData): Promise<void> {
        await this.openAddGenreModal();
        await this.fillGenreForm(data);
        await this.saveGenre();

        await this.verifyGenreVisible(data.name);
    }

    // -------------------------------------------------------
    // Edit actions
    // -------------------------------------------------------

    async openEditGenre(name: string): Promise<void> {
        const row = await this.getGenreRow(name);

        const editButton = await this.getVisibleLocator(
            row,
            S.rowActions.edit,
        );

        await editButton.click();

        await expect(await this.getModal()).toBeVisible();
    }

    async updateGenre(
        currentName: string,
        updates: Partial<GenreFormData>,
    ): Promise<void> {
        await this.openEditGenre(currentName);

        const modal = await this.getModal();

        if (updates.name !== undefined) {
            await this.fillGenreName(updates.name);
        }

        if (updates.english !== undefined) {
            await this.fillEnglishTranslation(updates.english);
        }

        if (updates.spanish !== undefined) {
            await this.fillSpanishTranslation(updates.spanish);
        }

        if (updates.categories !== undefined) {
            await this.setCategories(updates.categories);
        }

        if (updates.ageRestricted !== undefined) {
            await this.setAgeRestricted(updates.ageRestricted);
        }

        const saveButton = await this.getVisibleLocator(
            modal,
            S.modal.save,
        );

        await saveButton.click();

        await expect(modal).toBeHidden();

        if (updates.name !== undefined) {
            await this.verifyGenreVisible(updates.name);
        } else {
            await this.verifyGenreVisible(currentName);
        }
    }

    // -------------------------------------------------------
    // Delete actions
    // -------------------------------------------------------

    async deleteGenre(name: string): Promise<void> {
        const row = await this.getGenreRow(name);

        const deleteButton = await this.getVisibleLocator(
            row,
            S.rowActions.delete,
        );

        // Handle native browser confirmation dialogs.
        const dialogPromise = this.page
            .waitForEvent('dialog', { timeout: 1500 })
            .catch(() => null);

        await deleteButton.click();

        const dialog = await dialogPromise;

        if (dialog) {
            await dialog.accept();
        } else {
            // Handle application-rendered confirmation modal.
            for (const selector of S.confirmation.dialog) {
                const confirmation = this.page.locator(selector).last();

                if (await confirmation.isVisible().catch(() => false)) {
                    const confirmButton = await this.getVisibleLocator(
                        confirmation,
                        S.confirmation.confirm,
                    );

                    await confirmButton.click();
                    break;
                }
            }
        }

        await expect(
            this.getGenreRows().filter({ hasText: name }),
        ).toHaveCount(0);
    }

    // -------------------------------------------------------
    // Feedback
    // -------------------------------------------------------

    async verifySuccessMessage(): Promise<void> {
        const successMessage = await this.getPageVisibleLocator(
            S.feedback.success,
        );

        await expect(successMessage).toBeVisible();
    }

    async verifyErrorMessage(): Promise<void> {
        const errorMessage = await this.getPageVisibleLocator(
            S.feedback.error,
        );

        await expect(errorMessage).toBeVisible();
    }
}

export { GenreCategory };
