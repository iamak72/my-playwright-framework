
import { expect } from '@playwright/test';
import { test } from '../../../fixtures/test.fixture';
import { AdsAvodPage } from '../../../pages/ads-avod.page';

test.describe('Addons - Ads & AVOD Navigation', () => {
  test('should open Ads & AVOD module', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);

    await adsPage.gotoAdsAvod();

    await expect(page).toHaveURL(/AdsAVOD/i);
  });

  test('should navigate to Advertisements section', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);

    await adsPage.gotoAdsAvod();
    await adsPage.openAdvertisements();
  });

  test('should navigate to AVOD Campaigns section', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);

    await adsPage.gotoAdsAvod();
    await adsPage.openCampaigns();
  });

  test('should open and cancel New Advertisement modal', async ({
    page,
  }) => {
    const adsPage = new AdsAvodPage(page);

    await adsPage.gotoAdsAvod();
    await adsPage.openAdvertisements();
    await adsPage.clickNewAdvertisement();
    await adsPage.cancelAdvertisement();
  });

  test('should open and cancel New Campaign modal', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);

    await adsPage.gotoAdsAvod();
    await adsPage.openCampaigns();
    await adsPage.clickNewCampaign();
    await adsPage.cancelCampaign();
  });
});
