
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Users - Delete or Disable', () => {
    test('should disable or delete an existing user', async ({
        usersPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();

        const fullName = `PW Delete ${uniqueId}`;
        const email = `pw.delete.${uniqueId}@example.com`;
        const password = `Pw!${faker.string.alphanumeric(12)}9`;

        await usersPage.gotoUsers();
        await usersPage.clickAddUser();

        await usersPage.fillUserForm({
            fullName,
            email,
            username: `pw_delete_${uniqueId}`,
            password,
            roles: ['Default'],
        });

        await usersPage.saveUser();

        await usersPage.gotoUsers();

        const action = await usersPage.deleteOrDisableUser(email);

        await usersPage.searchUser(email);

        if (action === 'deleted') {
            await expect.poll(
                () => usersPage.isUserPresent(email),
                {
                    message: `Expected deleted user "${email}" to be absent`,
                    timeout: 15000,
                }
            ).toBe(false);
        } else {
            await expect.poll(
                () => usersPage.getUserStatus(email),
                {
                    message: `Expected user "${email}" to become disabled or inactive`,
                    timeout: 15000,
                }
            ).toMatch(/disabled|inactive/i);
        }
    });
});
