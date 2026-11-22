
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Users - Create', () => {
    test('should create a new user', async ({ usersPage }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();

        const fullName = faker.person.fullName();
        const email = `pw.user.${uniqueId}@example.com`;
        const password = `Pw!${faker.string.alphanumeric(12)}9`;

        await usersPage.gotoUsers();
        await usersPage.clickAddUser();

        await expect(
            usersPage.getPage().locator('[role="dialog"]')
        ).toBeVisible();

        await usersPage.fillUserForm({
            fullName,
            email,
            username: `pw_user_${uniqueId}`,
            password,
            roles: ['Default'],
        });

        await usersPage.saveUser();

        await usersPage.searchUser(email);

        await expect.poll(
            () => usersPage.isUserPresent(email),
            {
                message: `Expected user "${email}" to appear in the users grid`,
                timeout: 15000,
            }
        ).toBe(true);
    });
});
