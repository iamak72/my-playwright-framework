
import { test } from '../../../fixtures/test.fixture';
import { ScreensPage } from '../../../pages/screens.page';
import { createScreenTestData } from './screen-test-data';

test.describe('Screens - Delete', () => {
  test('should delete an existing screen successfully', async ({ page }) => {
    const screensPage = new ScreensPage(page);
    const screenData = createScreenTestData();

    await screensPage.gotoScreens();

    await test.step('Create screen for deletion', async () => {
      await screensPage.createScreen(screenData);
    });

    await test.step('Verify screen exists before deletion', async () => {
      await screensPage.verifyScreenVisible(
        screenData.internalName,
      );
    });

    await test.step('Delete screen', async () => {
      await screensPage.deleteScreen(screenData.internalName);
    });

    await test.step('Verify screen has been deleted', async () => {
      await screensPage.verifyScreenNotVisible(
        screenData.internalName,
      );
    });
  });
});
