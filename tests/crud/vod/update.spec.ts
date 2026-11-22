
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('VoD Library - Update', () => {
    test('should update an existing movie title', async ({ vodPage }) => {
        const originalTitle = `PW Update ${faker.string.alphanumeric(10)}`;
        const updatedTitle = `${originalTitle} Updated`;

        // Create a record to update.
        await vodPage.gotoVodLibrary();
        await vodPage.clickAddTitle();

        await vodPage.fillMovieForm({
            movieType: 'Movie',
            title: originalTitle,
            originalTitle,
            description: faker.lorem.sentence(),
            duration: 90,
        });

        await vodPage.saveMovie();

        // Edit the record.
        await vodPage.gotoVodLibrary();
        await vodPage.editMovie(originalTitle);

        await vodPage.fillMovieForm({
            title: updatedTitle,
            originalTitle: updatedTitle,
            description: 'Updated by Playwright automation.',
            duration: 125,
        });

        await vodPage.saveMovie();

        // Verify the updated record.
        await vodPage.gotoVodLibrary();
        await vodPage.searchMovie(updatedTitle);

        await expect.poll(
            () => vodPage.isMoviePresent(updatedTitle),
            {
                message: `Expected updated title "${updatedTitle}" to appear`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
