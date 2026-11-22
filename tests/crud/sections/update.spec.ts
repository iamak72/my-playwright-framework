
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Sections - Update', () => {
    test('should update an existing section name', async ({
        sectionsPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();
        const originalName = `PW Update ${uniqueId}`;
        const updatedName = `PW Updated ${uniqueId}`;
        const internalName = `pw_update_${uniqueId}`;

        // Create a section to update.
        await sectionsPage.gotoSections();
        await sectionsPage.clickNewSection();

        await sectionsPage.fillSectionForm({
            sectionName: originalName,
            internalName,
            type: 'Dynamic',
        });

        await sectionsPage.saveSection();

        // Open the edit form.
        await sectionsPage.gotoSections();
        await sectionsPage.editSection(originalName);

        // Update the section name.
        await sectionsPage.fillSectionForm({
            sectionName: updatedName,
            internalName,
            type: 'Dynamic',
        });

        await sectionsPage.saveSection();

        // Verify the updated name.
        await sectionsPage.gotoSections();
        await sectionsPage.searchSection(updatedName);

        await expect.poll(
            () => sectionsPage.isSectionPresent(updatedName),
            {
                message: `Expected updated section "${updatedName}"`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
