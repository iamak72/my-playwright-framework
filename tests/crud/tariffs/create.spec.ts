import { test, expect } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';

import {
  TariffsPage,
  TariffFormData,
} from '../../../pages/tariffs.page';

function generateTariffData(): TariffFormData {
  const uniqueId = faker.string.alphanumeric(8).toUpperCase();

  return {
    packageName: `QA Package ${faker.commerce.productName()} ${uniqueId}`,
    externalId: `QA-${uniqueId}`,
    service: 'IPTV',
    channelScope: 'All channels',
  };
}

test.describe('Administration - Tariffs - Create', () => {
  let tariffsPage: TariffsPage;

  test.beforeEach(async ({ page }) => {
    tariffsPage = new TariffsPage(page);
    await tariffsPage.gotoTariffs();
  });

  test('should create a new service package', async () => {
    const packageData = generateTariffData();

    await tariffsPage.createPackage(packageData);

    // Verify the new package is present in the listing.
    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);

    // Verify that the external ID is also searchable.
    await tariffsPage.clearSearch();
    await tariffsPage.searchPackage(packageData.externalId);
    await tariffsPage.verifyPackageVisible(packageData.externalId);
  });

  test('should create a package using VoD service and selected channels only', async () => {
    const packageData: TariffFormData = {
      packageName: `QA VoD ${faker.string.alphanumeric(8)}`,
      externalId: `VOD-${faker.string.alphanumeric(8).toUpperCase()}`,
      service: 'VoD',
      channelScope: 'Selected channels only',
    };

    await tariffsPage.createPackage(packageData);

    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);
  });
});