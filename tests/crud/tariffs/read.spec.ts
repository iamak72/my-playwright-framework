import { test } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';

import {
  TariffsPage,
  TariffFormData,
} from '../../../pages/tariffs.page';

function generateTariffData(): TariffFormData {
  const uniqueId = faker.string.alphanumeric(8).toUpperCase();

  return {
    packageName: `QA Read ${uniqueId}`,
    externalId: `READ-${uniqueId}`,
    service: 'IPTV',
    channelScope: 'All channels',
  };
}

test.describe('Administration - Tariffs - Read and Search', () => {
  let tariffsPage: TariffsPage;

  test.beforeEach(async ({ page }) => {
    tariffsPage = new TariffsPage(page);
    await tariffsPage.gotoTariffs();
  });

  test('should find a package by package name', async () => {
    const packageData = generateTariffData();

    await tariffsPage.createPackage(packageData);

    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);
  });

  test('should find a package by external ID', async () => {
    const packageData = generateTariffData();

    await tariffsPage.createPackage(packageData);

    await tariffsPage.searchPackage(packageData.externalId);
    await tariffsPage.verifyPackageVisible(packageData.externalId);
  });

  test('should not show an unrelated package in search results', async () => {
    const packageData = generateTariffData();

    await tariffsPage.createPackage(packageData);

    const unmatchedSearch = `NO_MATCH_${faker.string.alphanumeric(10)}`;

    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);

    await tariffsPage.clearSearch();
    await tariffsPage.searchPackage(unmatchedSearch);

    await tariffsPage.verifyPackageNotVisible(packageData.packageName);
  });
});