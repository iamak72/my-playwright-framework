
import { test } from '../../../fixtures/test.fixture';
import { StoragePage } from '../../../pages/storage.page';
import {
  createStorageTestData,
  createUpdatedStorageData,
} from './storage-test-data';

test.describe('Storage - Update', () => {
  test('should update an existing storage volume', async ({ page }) => {
    const storagePage = new StoragePage(page);

    const originalData = createStorageTestData();
    const updatedData = createUpdatedStorageData(originalData);

    await storagePage.gotoStorage();

    await test.step('Create original storage record', async () => {
      await storagePage.createStorage(originalData);
    });

    await test.step('Update storage record', async () => {
      await storagePage.updateStorage(
        originalData.title,
        updatedData
      );
    });

    await test.step('Verify updated storage details', async () => {
      await storagePage.verifyStorageDetails(updatedData);
      await storagePage.verifyStorageNotVisible(originalData.title);
    });
  });
});
