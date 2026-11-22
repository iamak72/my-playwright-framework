
import { test, expect } from '../../../fixtures/test.fixture';
import { ScreensPage } from '../../../pages/screens.page';

import {
  createScreenTestData,
  createUpdatedScreenData,
} from './screen-test-data';

test.describe('Screens - Update', () => {
  test('should update an existing screen successfully', async ({ page }) => {
    const screensPage = new ScreensPage(page);

    const originalData = createScreenTestData();
    const updatedData = createUpdatedScreenData(originalData);

    await screensPage.gotoScreens();

    await test.step('Create screen for update', async () => {
      await screensPage.createScreen(originalData);
    });

    await test.step('Update screen details', async () => {
      await screensPage.updateScreen(
        originalData.internalName,
        updatedData,
      );
    });

    await test.step('Verify updated screen', async () => {
      await screensPage.searchScreen(updatedData.internalName);

      const row = await screensPage.getScreenRow(
        updatedData.internalName,
      );

      await expect(row).toContainText(updatedData.internalName);
      await expect(row).toContainText('Active');
      await expect(row).toContainText('LAHORE');
    });

    await screensPage.verifyScreenNotVisible(
      originalData.internalName,
    );
  });
});
