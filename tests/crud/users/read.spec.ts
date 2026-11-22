
import { faker } from '@faker-js/faker';

import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Users - Read', () => {
    test('should search for a user and read their grid details', async ({
        usersPage,
    }) => {
        const uniqueId = faker.string.alphanumeric(8).toLowerCase();

        const fullName = faker.person.fullName();
        const email = `pw.read.${uniqueId}@example.com`;
        const password = `Pw!${faker.string.alphanumeric(12)}9`;

        await usersPage.gotoUsers();
        await usersPage.clickAddUser();

        await usersPage.fillUserForm({
            fullName,
            email,
            username: `pw_read_${uniqueId}`,
            password,
            roles: ['Default'],
        });

        await usersPage.saveUser();

        await usersPage.gotoUsers();
        await usersPage.searchUser(email);

        await expect.poll(
            () => usersPage.isUserPresent(email),
            {
                message: `Expected user "${email}" to be present`,
                timeout: 15000,
            }
        ).toBe(true);

        const rowText = await usersPage.getUserRowText(email);

        expect(rowText).toContain(fullName);
        expect(rowText).toContain(email);

        const status = await usersPage.getUserStatus(email);

        expect(
            status,
            `Expected a status value to be displayed for "${email}"`
        ).not.toBe('');
    });
});
