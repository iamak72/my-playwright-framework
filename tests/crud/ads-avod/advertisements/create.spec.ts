
import { test } from '../../../../fixtures/test.fixture';
import { AdsAvodPage } from '../../../../pages/ads-avod.page';
import {
  generateAdvertisementData,
  generateCampaignData,
} from '../ads-test-data';

test.describe('Advertisements - Create', () => {
  test('should create an advertisement linked to an AVOD campaign', async ({
    page,
  }) => {
    const adsPage = new AdsAvodPage(page);

    const campaign = generateCampaignData();
    const advertisement = generateAdvertisementData(campaign.name);

    await adsPage.gotoAdsAvod();

    // Create the required campaign first.
    await adsPage.openCampaigns();
    await adsPage.createCampaign(campaign);

    // Create advertisement and associate it with that campaign.
    await adsPage.openAdvertisements();
    await adsPage.createAdvertisement(advertisement);

    await adsPage.searchAdvertisement(advertisement.heading);
    await adsPage.verifyAdvertisementVisible(advertisement.heading);
  });
});
