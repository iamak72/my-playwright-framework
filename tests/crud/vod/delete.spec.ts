
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('VoD Library - Delete', () => {
    test('should delete a movie title', async ({ vodPage }) => {
        const title = `PW Delete ${faker.string.alphanumeric(10)}`;

        // Create a record to delete.
        await vodPage.gotoVodLibrary();
        await vodPage.clickAddTitle();

        await vodPage.fillMovieForm({
            movieType: 'Movie',
            title,
            originalTitle: title,
            description: faker.lorem.sentence(),
            duration: 100,
        });

        await vodPage.saveMovie();

        // Delete the record.
        await vodPage.gotoVodLibrary();
        await vodPage.deleteMovie(title);

        // Confirm it is absent from the library.
        await vodPage.searchMovie(title);

        await expect.poll(
            () => vodPage.isMoviePresent(title),
            {
                message: `Expected deleted title "${title}" to be absent`,
                timeout: 15000,
            }
        ).toBe(false);
    });
});
