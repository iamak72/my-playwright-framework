
import { test } from '../../../../fixtures/test.fixture'; 
import { AdsAvodPage } from '../../../../pages/ads-avod.page'; 
import { generateCampaignData } from '../ads-test-data';

test.describe('AVOD Campaigns - Read', () => {
  test('should search and display the correct campaign', async ({
    page,
  }) => {
    const adsPage = new AdsAvodPage(page);
    const campaign = generateCampaignData();

    await adsPage.gotoAdsAvod();
    await adsPage.openCampaigns();

    await adsPage.createCampaign(campaign);

    await adsPage.searchCampaign(campaign.name);
    await adsPage.verifyCampaignVisible(campaign.name);
  });

  test('should not display a campaign for unmatched search', async ({
    page,
  }) => {
    const adsPage = new AdsAvodPage(page);
    const searchTerm = `No_Campaign_${Date.now()}`;

    await adsPage.gotoAdsAvod();
    await adsPage.openCampaigns();

    await adsPage.searchCampaign(searchTerm);
    await adsPage.verifyCampaignNotVisible(searchTerm);
  });

  test('should clear campaign search', async ({ page }) => {
    const adsPage = new AdsAvodPage(page);
    const campaign = generateCampaignData();

    await adsPage.gotoAdsAvod();
    await adsPage.openCampaigns();

    await adsPage.createCampaign(campaign);
    await adsPage.searchCampaign(campaign.name);
    await adsPage.verifyCampaignVisible(campaign.name);

    await adsPage.clearCampaignSearch();
    await adsPage.verifyCampaignVisible(campaign.name);
  });
});
