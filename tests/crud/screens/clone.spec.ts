
import { test, expect } from '../../../fixtures/test.fixture';
import { ScreensPage } from '../../../pages/screens.page';

import {
  createScreenTestData,
  createClonedScreenName,
} from './screen-test-data';

test.describe('Screens - Clone', () => {
  test('should clone an existing screen', async ({ page }) => {
    const screensPage = new ScreensPage(page);

    const originalData = createScreenTestData();
    const clonedName = createClonedScreenName();

    await screensPage.gotoScreens();

    await test.step('Create original screen', async () => {
      await screensPage.createScreen(originalData);
    });

    await test.step('Clone original screen', async () => {
      await screensPage.cloneScreen(originalData.internalName);
    });

    await test.step('Set unique name for cloned screen', async () => {
      // Assumption: Clone opens a prefilled screen form.
      await screensPage.fillInternalName(clonedName);
      await screensPage.saveScreen();
    });

    await test.step('Verify cloned screen in listing', async () => {
      await screensPage.verifyScreenVisible(clonedName);

      const row = await screensPage.getScreenRow(clonedName);

      await expect(row).toContainText(clonedName);
    });
  });
});
