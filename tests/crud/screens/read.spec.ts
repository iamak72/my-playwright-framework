
import { test, expect } from '../../../fixtures/test.fixture';
import { ScreensPage } from '../../../pages/screens.page';
import { createScreenTestData } from './screen-test-data';

test.describe('Screens - Read', () => {
  test('should display screen details in listing', async ({ page }) => {
    const screensPage = new ScreensPage(page);
    const screenData = createScreenTestData();

    await screensPage.gotoScreens();

    await test.step('Prepare test screen', async () => {
      await screensPage.createScreen(screenData);
    });

    await test.step('Search for created screen', async () => {
      await screensPage.searchScreen(screenData.internalName);
    });

    await test.step('Verify screen listing details', async () => {
      const row = await screensPage.getScreenRow(
        screenData.internalName,
      );

      await expect(row).toContainText(screenData.internalName);
      await expect(row).toContainText('Active');
      await expect(row).toContainText('KARACHI');
    });

    await test.step('Verify screen is visible', async () => {
      await screensPage.verifyScreenVisible(
        screenData.internalName,
      );
    });
  });
});
