
import { test } from '../../../../fixtures/test.fixture';
import { AdsAvodPage } from '../../../../pages/ads-avod.page';
import {
  generateAdvertisementData,
  generateCampaignData,
} from '../ads-test-data';

test.describe('Advertisements - Delete', () => {
  test('should delete an advertisement from the listing', async ({
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

    await adsPage.deleteAdvertisement(advertisement.heading);

    await adsPage.verifyAdvertisementNotVisible(
      advertisement.heading,
    );
  });
});
