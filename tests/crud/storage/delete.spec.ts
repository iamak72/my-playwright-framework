
import { test } from '../../../fixtures/test.fixture';
import { StoragePage } from '../../../pages/storage.page';
import { createStorageTestData } from './storage-test-data';

test.describe('Storage - Delete', () => {
  test('should delete an existing storage volume', async ({ page }) => {
    const storagePage = new StoragePage(page);
    const storageData = createStorageTestData();

    await storagePage.gotoStorage();

    await test.step('Create storage record for deletion', async () => {
      await storagePage.createStorage(storageData);
    });

    await test.step('Verify storage exists before deletion', async () => {
      await storagePage.verifyStorageVisible(storageData.title);
    });

    await test.step('Delete storage record', async () => {
      await storagePage.deleteStorage(storageData.title);
    });

    await test.step('Verify storage has been deleted', async () => {
      await storagePage.verifyStorageNotVisible(storageData.title);
    });
  });
});
