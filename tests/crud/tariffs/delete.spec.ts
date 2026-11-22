import { test } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';

import {
  TariffsPage,
  TariffFormData,
} from '../../../pages/tariffs.page';

function generateTariffData(): TariffFormData {
  const uniqueId = faker.string.alphanumeric(8).toUpperCase();

  return {
    packageName: `QA Delete ${uniqueId}`,
    externalId: `DELETE-${uniqueId}`,
    service: 'IPTV',
    channelScope: 'All channels',
  };
}

test.describe('Administration - Tariffs - Delete', () => {
  let tariffsPage: TariffsPage;

  test.beforeEach(async ({ page }) => {
    tariffsPage = new TariffsPage(page);
    await tariffsPage.gotoTariffs();
  });

  test('should delete an existing service package', async () => {
    const packageData = generateTariffData();

    // Arrange: create a package specifically for this test.
    await tariffsPage.createPackage(packageData);

    await tariffsPage.searchPackage(packageData.packageName);
    await tariffsPage.verifyPackageVisible(packageData.packageName);

    // Act: delete the package.
    await tariffsPage.deletePackage(packageData.packageName);

    // Assert: package should no longer exist in the listing.
    await tariffsPage.clearSearch();
    await tariffsPage.searchPackage(packageData.packageName);

    await tariffsPage.verifyPackageNotVisible(packageData.packageName);
  });
});