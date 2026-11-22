import { test, expect } from '../../../fixtures/test.fixture';

import { GenresPage } from '../../../pages/genres.page';
import { generateGenreData } from './genre-test-data';

test.describe('Administration - Genres Create', () => {
    test('should create a genre with translations, categories and age restriction', async ({
        page,
    }) => {
        const genresPage = new GenresPage(page);

        const genreData = generateGenreData({
            ageRestricted: true,
            categories: [
                'Cartoons',
                'Movies',
                'TV Shows',
            ],
        });

        await genresPage.gotoGenres();

        await genresPage.createGenre(genreData);

        // Verify that the newly created genre is present in the listing.
        await genresPage.searchGenre(genreData.name);
        await genresPage.verifyGenreVisible(genreData.name);

        const genreRow = await genresPage.getGenreRow(
            genreData.name,
        );

        await expect(genreRow).toContainText(genreData.name);
    });

    test('should create a genre with minimum required information', async ({
        page,
    }) => {
        const genresPage = new GenresPage(page);

        const genreData = generateGenreData({
            english: '',
            spanish: '',
            categories: [],
            ageRestricted: false,
        });

        await genresPage.gotoGenres();

        await genresPage.createGenre(genreData);

        await genresPage.searchGenre(genreData.name);
        await genresPage.verifyGenreVisible(genreData.name);
    });
});