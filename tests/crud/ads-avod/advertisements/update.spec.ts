
import { test } from '../../../../fixtures/test.fixture';
import { AdsAvodPage } from '../../../../pages/ads-avod.page';
import {
  generateAdvertisementData,
  generateCampaignData,
  generateUpdatedAdvertisementData,
} from '../ads-test-data';

test.describe('Advertisements - Update', () => {
  test('should update advertisement heading and targeting details', async ({
    page,
  }) => {
    const adsPage = new AdsAvodPage(page);

    const campaign = generateCampaignData();
    const originalAdvertisement = generateAdvertisementData(
      campaign.name,
    );
    const updatedAdvertisement = generateUpdatedAdvertisementData(
      campaign.name,
    );

    await adsPage.gotoAdsAvod();

    await adsPage.openCampaigns();
    await adsPage.createCampaign(campaign);

    await adsPage.openAdvertisements();
    await adsPage.createAdvertisement(originalAdvertisement);

    await adsPage.searchAdvertisement(originalAdvertisement.heading);
    await adsPage.verifyAdvertisementVisible(
      originalAdvertisement.heading,
    );

    await adsPage.updateAdvertisement(
      originalAdvertisement.heading,
      updatedAdvertisement,
    );

    await adsPage.searchAdvertisement(updatedAdvertisement.heading);
    await adsPage.verifyAdvertisementVisible(
      updatedAdvertisement.heading,
    );

    await adsPage.searchAdvertisement(originalAdvertisement.heading);
    await adsPage.verifyAdvertisementNotVisible(
      originalAdvertisement.heading,
    );
  });
});
