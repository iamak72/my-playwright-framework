
import { test, expect } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { ChannelsLocators } from '../../../locators/channels.locators';

test.describe('Channels - Create', () => {

    test('should create a new channel successfully', async ({ page }) => {

        const channelsLocators = new ChannelsLocators(page);

        const channelName = `Auto_Channel_${faker.string.alphanumeric(8)}`;

        // Navigate to Channels
        await page.goto('/live-tv');

        await expect(page).toHaveURL(/live-tv/);

        // Click Add Channel
        await channelsLocators.addChannelButton.click();

        // Verify editor page
        await expect(page).toHaveURL(/channel-editor/);

        // Verify auto-generated channel number
        await expect(
            channelsLocators.channelNumberInput
        ).toBeVisible();

        // Fill channel name
        await channelsLocators.channelNameInput.fill(channelName);

        // Enable status if currently disabled
        const statusToggle = channelsLocators.channelStatusToggle;

        if (await statusToggle.count() > 0) {
            if (await statusToggle.getAttribute('aria-checked') === 'false') {
                await statusToggle.click();
            }
        }

        // Save channel
        await channelsLocators.saveChannelButton.click();

        // Return to listing
        await page.goto('/live-tv');

        // Search created channel
        await channelsLocators.searchInput.fill(channelName);

        // Verify channel exists
        const channelRow = channelsLocators.getChannelRow(channelName);

        await expect(channelRow).toBeVisible();

        console.log(`Created channel: ${channelName}`);
    });

});
