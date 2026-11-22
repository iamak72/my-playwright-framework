
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('VoD Library - Read', () => {
    test('should search and display a movie title', async ({ vodPage }) => {
        const title = `PW Read ${faker.string.alphanumeric(10)}`;

        // Create a record for this independent read test.
        await vodPage.gotoVodLibrary();
        await vodPage.clickAddTitle();

        await vodPage.fillMovieForm({
            movieType: 'Movie',
            title,
            originalTitle: title,
            description: faker.lorem.sentence(),
            duration: 105,
        });

        await vodPage.saveMovie();

        // Search for the newly created record.
        await vodPage.gotoVodLibrary();
        await vodPage.searchMovie(title);

        await expect.poll(
            () => vodPage.isMoviePresent(title),
            {
                message: `Expected "${title}" to be displayed in the library`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
