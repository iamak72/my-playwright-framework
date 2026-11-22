import { test } from '../../../fixtures/test.fixture';

import { GenresPage } from '../../../pages/genres.page';
import { generateGenreData } from './genre-test-data';

test.describe('Administration - Genres Delete', () => {
    test('should delete an existing genre', async ({ page }) => {
        const genresPage = new GenresPage(page);
        const genreData = generateGenreData();

        await genresPage.gotoGenres();

        // Create a dedicated record for deletion.
        await genresPage.createGenre(genreData);

        await genresPage.searchGenre(genreData.name);
        await genresPage.verifyGenreVisible(genreData.name);

        // Delete and verify that the record is removed.
        await genresPage.deleteGenre(genreData.name);

        await genresPage.verifyGenreNotVisible(genreData.name);
    });
});