
import { expect } from '@playwright/test';
import { test } from '../../../fixtures/test.fixture';
import { MultiFilterPage } from '../../../pages/multi-filter.page';

test.describe('Administration - Multi Filter Navigation', () => {
  test('should navigate to Multi Filter module', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);

    await multiFilterPage.gotoMultiFilter();

    await expect(page).toHaveURL(/MultiFilter/i);
    await multiFilterPage.verifyMultiFilterPage();
  });

  test('should open and cancel New Filter modal', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);

    await multiFilterPage.gotoMultiFilter();
    await multiFilterPage.clickNewFilter();
    await multiFilterPage.cancelFilter();
  });

  test('should display filter listing tabs', async ({ page }) => {
    const multiFilterPage = new MultiFilterPage(page);

    await multiFilterPage.gotoMultiFilter();

    await multiFilterPage.selectListingTab('All');
    await multiFilterPage.selectListingTab('Presets');
    await multiFilterPage.selectListingTab('Custom');
  });
});
