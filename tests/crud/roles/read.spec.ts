
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Roles - Read', () => {
    test('should search for and read a role from the grid', async ({
        rolesPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();
        const roleName = `PW Read Role ${uniqueId}`;

        await rolesPage.gotoRoles();
        await rolesPage.clickAddRole();

        await rolesPage.fillRoleForm({
            roleName,
            permissions: [
                { module: 'Users', action: 'VIEW' },
                { module: 'Roles', action: 'VIEW' },
            ],
        });

        await rolesPage.saveRole();

        await rolesPage.gotoRoles();
        await rolesPage.searchRole(roleName);

        await expect.poll(
            () => rolesPage.isRolePresent(roleName),
            {
                message: `Expected role "${roleName}" to be present`,
                timeout: 15000,
            }
        ).toBe(true);

        const rowText = await rolesPage.getRoleRowText(roleName);

        expect(rowText).toContain(roleName);
        expect(rowText.length).toBeGreaterThan(roleName.length);
    });
});
