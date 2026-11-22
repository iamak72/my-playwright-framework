
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('VoD Library - Create', () => {
    test('should create a new movie title', async ({ vodPage }) => {
        const title = `PW Movie ${faker.string.alphanumeric(10)}`;
        const description = faker.lorem.sentence();

        await vodPage.gotoVodLibrary();
        await vodPage.clickAddTitle();

        await vodPage.fillMovieForm({
            movieType: 'Movie',
            title,
            originalTitle: title,
            description,
            duration: faker.number.int({ min: 70, max: 180 }),
            ageRating: 'PG',
        });

        await vodPage.saveMovie();

        await vodPage.gotoVodLibrary();
        await vodPage.searchMovie(title);

        await expect.poll(
            () => vodPage.isMoviePresent(title),
            {
                message: `Expected "${title}" to appear in the VoD Library`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
