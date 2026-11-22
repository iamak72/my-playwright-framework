import { test } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';

import {
  TariffsPage,
  TariffFormData,
} from '../../../pages/tariffs.page';

function generateTariffData(): TariffFormData {
  const uniqueId = faker.string.alphanumeric(8).toUpperCase();

  return {
    packageName: `QA Update ${uniqueId}`,
    externalId: `UPDATE-${uniqueId}`,
    service: 'IPTV',
    channelScope: 'All channels',
  };
}

test.describe('Administration - Tariffs - Update', () => {
  let tariffsPage: TariffsPage;

  test.beforeEach(async ({ page }) => {
    tariffsPage = new TariffsPage(page);
    await tariffsPage.gotoTariffs();
  });

  test('should update package name', async () => {
    const packageData = generateTariffData();
    const updatedName = `Updated ${faker.commerce.productName()} ${faker.string.alphanumeric(6)}`;

    await tariffsPage.createPackage(packageData);

    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);

    await tariffsPage.updatePackage(packageData.packageName, {
      packageName: updatedName,
    });

    await tariffsPage.clearSearch();
    await tariffsPage.searchPackage(updatedName);

    await tariffsPage.verifyPackageVisible(updatedName);
    await tariffsPage.verifyPackageNotVisible(packageData.packageName);
  });

  test('should update external ID', async () => {
    const packageData = generateTariffData();
    const updatedExternalId =
      `UPDATED-${faker.string.alphanumeric(10).toUpperCase()}`;

    await tariffsPage.createPackage(packageData);

    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);

    await tariffsPage.updatePackage(packageData.packageName, {
      externalId: updatedExternalId,
    });

    await tariffsPage.clearSearch();
    await tariffsPage.searchPackage(updatedExternalId);

    await tariffsPage.verifyPackageVisible(updatedExternalId);
  });

  test('should update package service and channel scope', async () => {
    const packageData = generateTariffData();

    await tariffsPage.createPackage(packageData);

    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);

    await tariffsPage.updatePackage(packageData.packageName, {
      service: 'Radio',
      channelScope: 'Selected channels only',
    });

    // Confirm the package remains available after the update.
    await tariffsPage.clearSearch();
    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);
  });
});