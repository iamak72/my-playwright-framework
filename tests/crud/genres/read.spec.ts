import { test, expect } from '../../../fixtures/test.fixture';

import { GenresPage } from '../../../pages/genres.page';
import { generateGenreData } from './genre-test-data';

test.describe('Administration - Genres Read', () => {
    test('should search and display an existing genre', async ({
        page,
    }) => {
        const genresPage = new GenresPage(page);
        const genreData = generateGenreData();

        await genresPage.gotoGenres();

        // Create test data so the read test is independent.
        await genresPage.createGenre(genreData);

        await genresPage.searchGenre(genreData.name);

        const genreRow = await genresPage.getGenreRow(
            genreData.name,
        );

        await expect(genreRow).toBeVisible();
        await expect(genreRow).toContainText(genreData.name);
    });

    test('should not display records for an unmatched search term', async ({
        page,
    }) => {
        const genresPage = new GenresPage(page);

        const searchTerm = `No_Genre_${Date.now()}`;

        await genresPage.gotoGenres();
        await genresPage.searchGenre(searchTerm);

        await genresPage.verifyGenreNotVisible(searchTerm);
    });

    test('should clear the genre search filter', async ({
        page,
    }) => {
        const genresPage = new GenresPage(page);
        const genreData = generateGenreData();

        await genresPage.gotoGenres();
        await genresPage.createGenre(genreData);

        await genresPage.searchGenre(genreData.name);
        await genresPage.verifyGenreVisible(genreData.name);

        await genresPage.clearSearch();

        await expect(
            page.locator('input[placeholder="Search genres"]'),
        ).toHaveValue('');
    });
});