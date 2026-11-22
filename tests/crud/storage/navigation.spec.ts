
import { test } from '../../../fixtures/test.fixture';
import { StoragePage } from '../../../pages/storage.page';

test.describe('Storage - Navigation', () => {
  test('should navigate to Storage module successfully', async ({ page }) => {
    const storagePage = new StoragePage(page);

    await storagePage.gotoStorage();
    await storagePage.verifyStoragePage();
  });

  test('should display Storage overview sections', async ({ page }) => {
    const storagePage = new StoragePage(page);

    await storagePage.gotoStorage();

    await storagePage.verifyOverviewMetrics();
    await storagePage.verifyUnreferencedUploadsSection();
  });
});
