
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Sections - Read', () => {
    test('should search and read a section from the table', async ({
        sectionsPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();
        const sectionName = `PW Read ${uniqueId}`;
        const internalName = `pw_read_${uniqueId}`;

        // Create independent test data.
        await sectionsPage.gotoSections();
        await sectionsPage.clickNewSection();

        await sectionsPage.fillSectionForm({
            sectionName,
            internalName,
            type: 'Dynamic',
        });

        await sectionsPage.saveSection();

        // Search for the newly created section.
        await sectionsPage.gotoSections();
        await sectionsPage.searchSection(sectionName);

        await expect.poll(
            () => sectionsPage.isSectionPresent(sectionName),
            {
                message: `Expected "${sectionName}" in the Sections table`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
