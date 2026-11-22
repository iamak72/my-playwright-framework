
import { test } from '../../../../fixtures/test.fixture';
import { AdsAvodPage } from '../../../../pages/ads-avod.page';
import { generateCampaignData, generateUpdatedCampaignData } from '../ads-test-data';

test.describe('AVOD Campaigns - Update', () => {
    test('should update campaign details and budget', async ({ page }) => {
        const adsPage = new AdsAvodPage(page);

        const originalCampaign = generateCampaignData();
        const updatedCampaign = generateUpdatedCampaignData();

        await adsPage.gotoAdsAvod();
        await adsPage.openCampaigns();

        await adsPage.createCampaign(originalCampaign);

        await adsPage.searchCampaign(originalCampaign.name);
        await adsPage.verifyCampaignVisible(originalCampaign.name);

        await adsPage.updateCampaign(
            originalCampaign.name,
            updatedCampaign,
        );

        await adsPage.searchCampaign(updatedCampaign.name);
        await adsPage.verifyCampaignVisible(updatedCampaign.name);

        await adsPage.searchCampaign(originalCampaign.name);
        await adsPage.verifyCampaignNotVisible(originalCampaign.name);
    });
});
