
import { test } from '../../../../fixtures/test.fixture';
import { AdsAvodPage } from '../../../../pages/ads-avod.page';
import {
  generateAdvertisementData,
  generateCampaignData,
} from '../ads-test-data';

test.describe('Advertisements - Read', () => {
  test('should search and display the correct advertisement', async ({
    page,
  }) => {
    const adsPage = new AdsAvodPage(page);

    const campaign = generateCampaignData();
    const advertisement = generateAdvertisementData(campaign.name);

    await adsPage.gotoAdsAvod();

    await adsPage.openCampaigns();
    await adsPage.createCampaign(campaign);

    await adsPage.openAdvertisements();
    await adsPage.createAdvertisement(advertisement);

    await adsPage.searchAdvertisement(advertisement.heading);
    await adsPage.verifyAdvertisementVisible(advertisement.heading);
  });

  test('should not display an advertisement for unmatched search', async ({
    page,
  }) => {
    const adsPage = new AdsAvodPage(page);
    const searchTerm = `No_Advertisement_${Date.now()}`;

    await adsPage.gotoAdsAvod();
    await adsPage.openAdvertisements();

    await adsPage.searchAdvertisement(searchTerm);
    await adsPage.verifyAdvertisementNotVisible(searchTerm);
  });

  test('should clear advertisement search', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);

    const campaign = generateCampaignData();
    const advertisement = generateAdvertisementData(campaign.name);

    await adsPage.gotoAdsAvod();

    await adsPage.openCampaigns();
    await adsPage.createCampaign(campaign);

    await adsPage.openAdvertisements();
    await adsPage.createAdvertisement(advertisement);

    await adsPage.searchAdvertisement(advertisement.heading);
    await adsPage.verifyAdvertisementVisible(advertisement.heading);

    await adsPage.clearAdvertisementSearch();
    await adsPage.verifyAdvertisementVisible(advertisement.heading);
  });
});
