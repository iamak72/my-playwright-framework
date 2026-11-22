
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Sections - Delete', () => {
    test('should delete an existing section', async ({
        sectionsPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();
        const sectionName = `PW Delete ${uniqueId}`;
        const internalName = `pw_delete_${uniqueId}`;

        // Create a section to delete.
        await sectionsPage.gotoSections();
        await sectionsPage.clickNewSection();

        await sectionsPage.fillSectionForm({
            sectionName,
            internalName,
            type: 'Dynamic',
        });

        await sectionsPage.saveSection();

        // Delete the section.
        await sectionsPage.gotoSections();
        await sectionsPage.deleteSection(sectionName);

        // Search again and verify removal.
        await sectionsPage.searchSection(sectionName);

        await expect.poll(
            () => sectionsPage.isSectionPresent(sectionName),
            {
                message: `Expected deleted section "${sectionName}" to be absent`,
                timeout: 15000,
            }
        ).toBe(false);
    });
});
