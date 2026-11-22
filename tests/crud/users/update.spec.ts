
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Users - Update', () => {
    test('should update an existing user full name', async ({
        usersPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();

        const originalName = `PW User ${uniqueId}`;
        const updatedName = `PW Updated User ${uniqueId}`;
        const email = `pw.update.${uniqueId}@example.com`;
        const password = `Pw!${faker.string.alphanumeric(12)}9`;

        await usersPage.gotoUsers();
        await usersPage.clickAddUser();

        await usersPage.fillUserForm({
            fullName: originalName,
            email,
            username: `pw_update_${uniqueId}`,
            password,
            roles: ['Default'],
        });

        await usersPage.saveUser();

        await usersPage.gotoUsers();
        await usersPage.editUser(email);

        await usersPage.fillUserForm({
            fullName: updatedName,
            email,
        });

        await usersPage.saveUser();

        await usersPage.gotoUsers();
        await usersPage.searchUser(email);

        await expect.poll(
            () => usersPage.isUserPresent(email),
            {
                message: `Expected updated user "${email}" to remain in the grid`,
                timeout: 15000,
            }
        ).toBe(true);

        const updatedRowText = await usersPage.getUserRowText(email);

        expect(updatedRowText).toContain(updatedName);
        expect(updatedRowText).not.toContain(originalName);
    });
});
