
import { test } from '../../../../fixtures/test.fixture'; 
import { AdsAvodPage } from '../../../../pages/ads-avod.page'; 
import { generateCampaignData } from '../ads-test-data';

test.describe('AVOD Campaigns - Delete', () => {
  test('should delete an AVOD campaign', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);
    const campaign = generateCampaignData();

    await adsPage.gotoAdsAvod();
    await adsPage.openCampaigns();

    await adsPage.createCampaign(campaign);

    await adsPage.searchCampaign(campaign.name);
    await adsPage.verifyCampaignVisible(campaign.name);

    await adsPage.deleteCampaign(campaign.name);

    await adsPage.verifyCampaignNotVisible(campaign.name);
  });
});
