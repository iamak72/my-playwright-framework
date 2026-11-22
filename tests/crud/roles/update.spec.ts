
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Roles - Update', () => {
    test('should update a role name and permissions', async ({
        rolesPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();

        const originalName = `PW Original Role ${uniqueId}`;
        const updatedName = `PW Updated Role ${uniqueId}`;

        await rolesPage.gotoRoles();
        await rolesPage.clickAddRole();

        await rolesPage.fillRoleForm({
            roleName: originalName,
            permissions: [
                { module: 'Users', action: 'VIEW' },
            ],
        });

        await rolesPage.saveRole();

        await rolesPage.gotoRoles();
        await rolesPage.editRole(originalName);

        await rolesPage.fillRoleForm({
            roleName: updatedName,
            permissions: [
                { module: 'Channels', action: 'VIEW' },
                { module: 'Channels', action: 'MANAGE' },
                { module: 'Content', action: 'VIEW' },
            ],
        });

        await rolesPage.saveRole();

        await rolesPage.gotoRoles();
        await rolesPage.searchRole(updatedName);

        await expect.poll(
            () => rolesPage.isRolePresent(updatedName),
            {
                message: `Expected updated role "${updatedName}"`,
                timeout: 15000,
            }
        ).toBe(true);

        const rowText = await rolesPage.getRoleRowText(updatedName);

        expect(rowText).toContain(updatedName);
        expect(rowText).not.toContain(originalName);
    });
});
