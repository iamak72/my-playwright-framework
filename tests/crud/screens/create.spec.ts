
import { test, expect } from '../../../fixtures/test.fixture';
import { ScreensPage } from '../../../pages/screens.page';
import { createScreenTestData } from './screen-test-data';

test.describe('Screens - Create', () => {
  test('should create a new screen successfully', async ({ page }) => {
    const screensPage = new ScreensPage(page);
    const screenData = createScreenTestData();

    await screensPage.gotoScreens();

    await test.step('Create screen', async () => {
      await screensPage.createScreen(screenData);
    });

    await test.step('Verify created screen in listing', async () => {
      await screensPage.searchScreen(screenData.internalName);

      const row = await screensPage.getScreenRow(
        screenData.internalName,
      );

      await expect(row).toContainText(screenData.internalName);
      await expect(row).toContainText('Active');
      await expect(row).toContainText('KARACHI');
    });
  });
});
