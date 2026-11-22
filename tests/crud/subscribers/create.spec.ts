
import { test } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import type { AccountFormData } from '../../../pages/accounts.page';

const accountGroup = process.env.PW_ACCOUNT_GROUP ?? 'Default';
const tariffPlan = process.env.PW_ACCOUNT_TARIFF ?? 'Default';

function generateAccount(): AccountFormData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    username: `qa_${faker.string.alphanumeric(12).toLowerCase()}`,
    password: `Qa@${faker.string.alphanumeric(12)}1`,
    group: accountGroup,
    tariffPlan,
    balance: faker.number.int({ min: 10, max: 500 }),
    externalId: `EXT-${faker.string.alphanumeric(10)}`,
    firstName,
    middleName: faker.person.middleName(),
    lastName,
    phone: `+923${faker.string.numeric(9)}`,
    authPhone: `+923${faker.string.numeric(9)}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    city: faker.location.city(),
    parentPin: faker.string.numeric(4),
    masterPin: faker.string.numeric(4),
    deviceServices: 3,
    appServices: 3,
    comments: `Playwright account ${faker.string.uuid()}`,
    isActive: true,
  };
}

test.describe('Subscribers - Create Account', () => {
  test.beforeEach(async ({ accountsPage }) => {
    await accountsPage.gotoAccounts();
  });

  test('should create account successfully', async ({ accountsPage }) => {
    const account = generateAccount();

    await accountsPage.createAccount(account);
    await accountsPage.searchAccount(account.username);

    await accountsPage.verifyAccountVisible(account.username);
  });
});
