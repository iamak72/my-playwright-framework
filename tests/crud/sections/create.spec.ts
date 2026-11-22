
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Sections - Create', () => {
    test('should create a new Dynamic section', async ({
        sectionsPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();
        const sectionName = `PW Section ${uniqueId}`;
        const internalName = `pw_section_${uniqueId}`;

        await sectionsPage.gotoSections();

        await sectionsPage.clickNewSection();

        await sectionsPage.fillSectionForm({
            sectionName,
            internalName,
            type: 'Dynamic',
        });

        await sectionsPage.saveSection();

        await sectionsPage.gotoSections();
        await sectionsPage.searchSection(sectionName);

        await expect.poll(
            () => sectionsPage.isSectionPresent(sectionName),
            {
                message: `Expected section "${sectionName}" to appear`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
