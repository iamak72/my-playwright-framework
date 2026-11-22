
import { test } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import type { AccountFormData } from '../../../pages/accounts.page';

const group = process.env.PW_ACCOUNT_GROUP ?? 'Default';
const tariff = process.env.PW_ACCOUNT_TARIFF ?? 'Default';

function generateAccount(): AccountFormData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    username: `qa_${faker.string.alphanumeric(12).toLowerCase()}`,
    password: `Qa@${faker.string.alphanumeric(12)}1`,
    group,
    tariffPlan: tariff,
    balance: 100,
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    isActive: true,
  };
}

test.describe('Subscribers - Delete Account', () => {
  test.beforeEach(async ({ accountsPage }) => {
    await accountsPage.gotoAccounts();
  });

  test('should delete subscriber account', async ({ accountsPage }) => {
    const account = generateAccount();

    await accountsPage.createAccount(account);
    await accountsPage.searchAccount(account.username);

    await accountsPage.deleteAccount(account.username);

    await accountsPage.verifyAccountNotVisible(account.username);
  });
});
