import { test, expect } from '../../../fixtures/test.fixture';

import { GenresPage } from '../../../pages/genres.page';
import {
    generateGenreData,
    generateGenreName,
} from './genre-test-data';

test.describe('Administration - Genres Update', () => {
    test('should update an existing genre name', async ({
        page,
    }) => {
        const genresPage = new GenresPage(page);

        const genreData = generateGenreData();
        const updatedName = generateGenreName();

        await genresPage.gotoGenres();

        // Create a genre to ensure the test is independent.
        await genresPage.createGenre(genreData);

        await genresPage.searchGenre(genreData.name);

        await genresPage.updateGenre(
            genreData.name,
            {
                name: updatedName,
            },
        );

        await genresPage.searchGenre(updatedName);

        const updatedRow = await genresPage.getGenreRow(
            updatedName,
        );

        await expect(updatedRow).toContainText(updatedName);

        await genresPage.verifyGenreNotVisible(genreData.name);
    });

    test('should update genre categories and age restriction', async ({
        page,
    }) => {
        const genresPage = new GenresPage(page);
        const genreData = generateGenreData({
            categories: ['Movies'],
            ageRestricted: false,
        });

        await genresPage.gotoGenres();

        await genresPage.createGenre(genreData);

        await genresPage.searchGenre(genreData.name);

        await genresPage.updateGenre(
            genreData.name,
            {
                categories: [
                    'Islamic',
                    'TV Shows',
                ],
                ageRestricted: true,
            },
        );

        const updatedRow = await genresPage.getGenreRow(
            genreData.name,
        );

        await expect(updatedRow).toContainText(
            /Islamic|TV Shows/i,
        );
    });
});