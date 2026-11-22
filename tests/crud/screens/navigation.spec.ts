
import { test } from '../../../fixtures/test.fixture';
import { ScreensPage } from '../../../pages/screens.page';

test.describe('Screens - Navigation', () => {
  test('should navigate to Screens listing', async ({ page }) => {
    const screensPage = new ScreensPage(page);

    await screensPage.gotoScreens();
    await screensPage.verifyScreensPage();
    await screensPage.verifyScreenCountVisible();
    await screensPage.verifySubscriberTestingTool();
  });
});
