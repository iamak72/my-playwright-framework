import { test, expect } from '../../../fixtures/test.fixture';

import { GenresPage } from '../../../pages/genres.page';

test.describe('Administration - Genres Navigation', () => {
    test('should navigate to Genres listing page', async ({ page }) => {
        const genresPage = new GenresPage(page);

        await genresPage.gotoGenres();

        await expect(page).toHaveURL(
            new RegExp('/Genres', 'i'),
        );
    });

    test('should open Add Genre modal', async ({ page }) => {
        const genresPage = new GenresPage(page);

        await genresPage.gotoGenres();

        await genresPage.openAddGenreModal();

        await expect(
            page.getByRole('dialog').last(),
        ).toBeVisible();
    });

    test('should close Add Genre modal using Cancel', async ({ page }) => {
        const genresPage = new GenresPage(page);

        await genresPage.gotoGenres();

        await genresPage.openAddGenreModal();
        await genresPage.cancelGenre();

        await expect(
            page.getByRole('dialog'),
        ).toBeHidden();
    });
});