
import { test, expect } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { ChannelsLocators } from '../../../locators/channels.locators';

test.describe('Channels - Read', () => {

    test('should search and verify channel details', async ({ page }) => {

        const channelsLocators = new ChannelsLocators(page);

        const channelName = `Read_Channel_${faker.string.alphanumeric(8)}`;

        // Navigate to Channels
        await page.goto('/live-tv');

        // Create test channel
        await channelsLocators.addChannelButton.click();

        await channelsLocators.channelNameInput.fill(channelName);

        await channelsLocators.saveChannelButton.click();

        // Navigate to listing
        await page.goto('/live-tv');

        // Search channel
        await channelsLocators.searchInput.fill(channelName);

        const channelRow = channelsLocators.getChannelRow(channelName);

        // Verify channel exists
        await expect(channelRow).toBeVisible();

        // Verify table exists
        await expect(channelsLocators.channelsTable).toBeVisible();

        // Verify table headers
        await expect(channelsLocators.tableHeaders).toContainText([
            'Number',
            'Name',
            'Status'
        ]);

        // Verify channel name
        await expect(channelRow).toContainText(channelName);

        console.log(`Verified channel: ${channelName}`);
    });

});
