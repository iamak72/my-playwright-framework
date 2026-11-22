
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Roles - Delete', () => {
    test('should delete an existing role', async ({ rolesPage }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();
        const roleName = `PW Delete Role ${uniqueId}`;

        await rolesPage.gotoRoles();
        await rolesPage.clickAddRole();

        await rolesPage.fillRoleForm({
            roleName,
            permissions: [
                { module: 'Users', action: 'VIEW' },
            ],
        });

        await rolesPage.saveRole();

        await rolesPage.gotoRoles();
        await rolesPage.deleteRole(roleName);

        await rolesPage.searchRole(roleName);

        await expect.poll(
            () => rolesPage.isRolePresent(roleName),
            {
                message: `Expected deleted role "${roleName}" to be absent`,
                timeout: 15000,
            }
        ).toBe(false);
    });
});
