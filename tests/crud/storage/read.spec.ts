
import { test } from '../../../fixtures/test.fixture';
import { StoragePage } from '../../../pages/storage.page';
import { createStorageTestData } from './storage-test-data';

test.describe('Storage - Read', () => {
  test('should search and verify an existing storage volume', async ({ page }) => {
    const storagePage = new StoragePage(page);
    const storageData = createStorageTestData();

    await storagePage.gotoStorage();

    await test.step('Create test storage record', async () => {
      await storagePage.createStorage(storageData);
    });

    await test.step('Search for the storage record', async () => {
      await storagePage.searchStorage(storageData.title);
      await storagePage.verifyStorageVisible(storageData.title);
    });

    await test.step('Verify storage information', async () => {
      await storagePage.verifyStorageDetails(storageData);
    });
  });
});
