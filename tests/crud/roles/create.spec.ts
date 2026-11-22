
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Roles - Create', () => {
    test('should create a role with selected permissions', async ({
        rolesPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();
        const roleName = `PW Role ${uniqueId}`;

        await rolesPage.gotoRoles();
        await rolesPage.clickAddRole();

        await expect(
            rolesPage.getPage().locator('[role="dialog"]')
        ).toBeVisible();

        await rolesPage.fillRoleForm({
            roleName,
            permissions: [
                { module: 'Users', action: 'VIEW' },
                { module: 'Users', action: 'MANAGE' },
                { module: 'Channels', action: 'VIEW' },
            ],
        });

        await rolesPage.saveRole();

        await rolesPage.gotoRoles();
        await rolesPage.searchRole(roleName);

        await expect.poll(
            () => rolesPage.isRolePresent(roleName),
            {
                message: `Expected role "${roleName}" to appear in the roles grid`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
