
import { Page, Locator, expect } from '@playwright/test';

import { BasePage } from './base.page';
import {
    VodLocators,
    getVodItemCard,
} from '../locators/vod.locators';

export type VodMovieType = 'Movie' | 'TV series';
export type VodAgeRating = 'None' | 'PG' | '12' | '15' | '18';

export interface MovieFormData {
    title: string;
    description: string;
    originalTitle?: string;
    category?: string;
    genre?: string;
    duration?: number;
    movieType?: VodMovieType;
    ageRating?: VodAgeRating;
    tmdbId?: string;
    trailerUrl?: string;
    country?: string;
    audioLanguages?: string;
    director?: string;
}

export class VodPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the VoD Library.
     */
    async gotoVodLibrary(): Promise<void> {
        await this.navigateTo('/content');

        await this.page.locator(VodLocators.addTitleButton)
            .waitFor({
                state: 'visible',
                timeout: 15000,
            });
    }

    /**
     * Open the Add title form.
     */
    async clickAddTitle(): Promise<void> {
        await this.page.locator(VodLocators.addTitleButton).click();

        await this.page.locator(VodLocators.titleInput)
            .waitFor({
                state: 'visible',
                timeout: 10000,
            });
    }

    /**
     * Select Movie or TV series using the form's button controls.
     */
    private async selectMovieType(type: VodMovieType): Promise<void> {
        const selector = type === 'Movie'
            ? VodLocators.movieTypeMovieButton
            : VodLocators.movieTypeTvSeriesButton;

        await this.page.locator(selector).click();
    }

    /**
     * Select an age restriction using its button.
     */
    private async selectAgeRating(
        rating: VodAgeRating
    ): Promise<void> {
        const selectors: Record<VodAgeRating, string> = {
            None: VodLocators.ageRestrictionNoneButton,
            PG: VodLocators.ageRestrictionPgButton,
            '12': VodLocators.ageRestriction12Button,
            '15': VodLocators.ageRestriction15Button,
            '18': VodLocators.ageRestriction18Button,
        };

        await this.page.locator(selectors[rating]).click();
    }

    /**
     * Select an option from a native HTML select element.
     */
    private async selectNativeOption(
        selector: string,
        label: string
    ): Promise<void> {
        const dropdown = this.page.locator(selector).first();

        await dropdown.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await dropdown.selectOption({ label });
    }

    /**
     * Fill the VoD movie form.
     */
    async fillMovieForm(data: MovieFormData): Promise<void> {
        if (data.movieType) {
            await this.selectMovieType(data.movieType);
        }

        if (data.tmdbId) {
            await this.page.locator(VodLocators.tmdbIdInput)
                .fill(data.tmdbId);

            await this.page.locator(VodLocators.retrieveButton).click();
        }

        await this.page.locator(VodLocators.titleInput)
            .fill(data.title);

        await this.page.locator(VodLocators.descriptionInput)
            .fill(data.description);

        if (data.originalTitle !== undefined) {
            await this.page.locator(VodLocators.originalTitleInput)
                .fill(data.originalTitle);
        }

        if (data.category) {
            await this.selectNativeOption(
                VodLocators.categorySelect,
                data.category
            );
        }

        if (data.genre) {
            await this.selectNativeOption(
                VodLocators.genreSelect,
                data.genre
            );
        }

        if (data.duration !== undefined) {
            await this.page.locator(VodLocators.durationInput)
                .fill(String(data.duration));
        }

        if (data.ageRating) {
            await this.selectAgeRating(data.ageRating);
        }

        if (data.trailerUrl !== undefined) {
            await this.page.locator(VodLocators.trailerUrlInput)
                .fill(data.trailerUrl);
        }

        if (data.country !== undefined) {
            await this.page.locator(VodLocators.countryInput)
                .fill(data.country);
        }

        if (data.audioLanguages !== undefined) {
            await this.page.locator(VodLocators.audioLanguagesInput)
                .fill(data.audioLanguages);
        }

        if (data.director !== undefined) {
            await this.page.locator(VodLocators.directorInput)
                .fill(data.director);
        }
    }

    /**
     * Save a new or edited VoD title.
     */
    async saveMovie(): Promise<void> {
        const saveButton = this.page.locator(VodLocators.saveButton)
            .first();

        await saveButton.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await expect(saveButton).toBeEnabled();
        await saveButton.click();

        // Wait for the form to close or navigation to complete.
        await expect(
            this.page.locator(VodLocators.titleInput)
        ).toBeHidden({ timeout: 15000 });
    }

    /**
     * Search the VoD Library by title.
     */
    async searchMovie(title: string): Promise<void> {
        const searchInput = this.page.locator(VodLocators.searchInput);

        await searchInput.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await searchInput.fill(title);
    }

    /**
     * Check whether a title is visible in the library.
     */
    async isMoviePresent(title: string): Promise<boolean> {
        const card = getVodItemCard(this.page, title);

        return card.isVisible().catch(() => false);
    }

    /**
     * Open the edit form for an existing title.
     */
    async editMovie(title: string): Promise<void> {
        await this.searchMovie(title);

        const card = getVodItemCard(this.page, title);

        await card.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const editButton = card.locator(VodLocators.editButton).first();

        await editButton.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await editButton.click();

        await this.page.locator(VodLocators.titleInput)
            .waitFor({
                state: 'visible',
                timeout: 10000,
            });
    }

    /**
     * Delete or move a title to trash.
     */
    async deleteMovie(title: string): Promise<void> {
        await this.searchMovie(title);

        const card = getVodItemCard(this.page, title);

        await card.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        const deleteAction = card.locator(
            `${VodLocators.deleteButton}, ${VodLocators.trashButton}`
        ).first();

        await deleteAction.waitFor({
            state: 'visible',
            timeout: 5000,
        });

        await deleteAction.click();

        const dialog = this.page.locator(
            VodLocators.confirmationDialog
        );

        if (await dialog.isVisible().catch(() => false)) {
            const confirmButton = dialog.locator(
                VodLocators.confirmDeleteButton
            ).first();

            await confirmButton.waitFor({
                state: 'visible',
                timeout: 5000,
            });

            await confirmButton.click();
        }

        await expect(card).toBeHidden({ timeout: 15000 });
    }
}
