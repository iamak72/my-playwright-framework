
import { test } from '../../../fixtures/test.fixture';
import { StoragePage } from '../../../pages/storage.page';
import { createStorageTestData } from './storage-test-data';

test.describe('Storage - Create', () => {
  test('should create a new storage volume', async ({ page }) => {
    const storagePage = new StoragePage(page);
    const storageData = createStorageTestData();

    await test.step('Navigate to Storage module', async () => {
      await storagePage.gotoStorage();
    });

    await test.step('Create storage volume', async () => {
      await storagePage.createStorage(storageData);
    });

    await test.step('Verify created storage details', async () => {
      await storagePage.verifyStorageDetails(storageData);
    });
  });
});
