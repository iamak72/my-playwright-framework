
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

test.describe('Subscribers - Update Account', () => {
  test.beforeEach(async ({ accountsPage }) => {
    await accountsPage.gotoAccounts();
  });

  test('should update account name and balance', async ({ accountsPage }) => {
    const account = generateAccount();

    await accountsPage.createAccount(account);

    const updatedName = faker.person.firstName();
    const updatedBalance = faker.number.int({ min: 600, max: 1000 });

    await accountsPage.editAccount(account.username, {
      firstName: updatedName,
      balance: updatedBalance,
    });

    await accountsPage.searchAccount(account.username);
    await accountsPage.verifyAccountVisible(account.username);
  });

  test('should update account tariff plan', async ({ accountsPage }) => {
    const updatedTariff = process.env.PW_ACCOUNT_UPDATED_TARIFF;

    test.skip(!updatedTariff, 'Set PW_ACCOUNT_UPDATED_TARIFF first.');

    const account = generateAccount();

    await accountsPage.createAccount(account);

    await accountsPage.editAccount(account.username, {
      tariffPlan: updatedTariff!,
    });

    await accountsPage.searchAccount(account.username);
    await accountsPage.verifyAccountVisible(account.username);
  });

  test('should toggle account status', async ({ accountsPage }) => {
    const account = generateAccount();

    await accountsPage.createAccount(account);
    await accountsPage.searchAccount(account.username);

    await accountsPage.toggleAccountStatus(account.username);

    await accountsPage.verifyAccountVisible(account.username);
  });
});
