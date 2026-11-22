
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
    phone: `+923${faker.string.numeric(9)}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    isActive: true,
  };
}

test.describe('Subscribers - Read/Search Account', () => {
  test.beforeEach(async ({ accountsPage }) => {
    await accountsPage.gotoAccounts();
  });

  test('should search account by username', async ({ accountsPage }) => {
    const account = generateAccount();

    await accountsPage.createAccount(account);
    await accountsPage.searchAccount(account.username);

    await accountsPage.verifyAccountVisible(account.username);
  });

  test('should search account by full name', async ({ accountsPage }) => {
    const account = generateAccount();

    await accountsPage.createAccount(account);

    await accountsPage.searchAccount(
      `${account.firstName} ${account.lastName}`,
    );

    await accountsPage.verifyAccountVisible(account.username);
  });

  test('should search account by email', async ({ accountsPage }) => {
    const account = generateAccount();

    await accountsPage.createAccount(account);
    await accountsPage.searchAccount(account.email!);

    await accountsPage.verifyAccountVisible(account.username);
  });
});
