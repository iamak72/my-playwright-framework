
import { test } from '../../../../fixtures/test.fixture'; 
import { AdsAvodPage } from '../../../../pages/ads-avod.page'; 
import { generateCampaignData } from '../ads-test-data';

test.describe('AVOD Campaigns - Create', () => {
  test('should create a new AVOD campaign', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);
    const campaign = generateCampaignData();

    await adsPage.gotoAdsAvod();
    await adsPage.openCampaigns();

    await adsPage.createCampaign(campaign);

    await adsPage.searchCampaign(campaign.name);
    await adsPage.verifyCampaignVisible(campaign.name);
  });
});
