
import { test, expect } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { ChannelsLocators } from '../../../locators/channels.locators';

test.describe('Channels - Update', () => {

    test('should update an existing channel successfully', async ({ page }) => {

        const channelsLocators = new ChannelsLocators(page);

        const originalName = `Update_Channel_${faker.string.alphanumeric(8)}`;

        const updatedName = `Updated_Channel_${faker.string.alphanumeric(8)}`;

        // Navigate to Channels
        await page.goto('/live-tv');

        // Create test channel
        await channelsLocators.addChannelButton.click();

        await channelsLocators.channelNameInput.fill(originalName);

        await channelsLocators.saveChannelButton.click();

        // Return to listing
        await page.goto('/live-tv');

        // Search original channel
        await channelsLocators.searchInput.fill(originalName);

        const channelRow = channelsLocators.getChannelRow(originalName);

        await expect(channelRow).toBeVisible();

        // Click edit
        await channelsLocators.getEditButton(channelRow).click();

        // Verify editor
        await expect(page).toHaveURL(/channel-editor/);

        // Update name
        await channelsLocators.channelNameInput.fill(updatedName);

        // Save changes
        await channelsLocators.saveChannelButton.click();

        // Return to listing
        await page.goto('/live-tv');

        // Search updated channel
        await channelsLocators.searchInput.fill(updatedName);

        const updatedRow = channelsLocators.getChannelRow(updatedName);

        await expect(updatedRow).toBeVisible();

        // Verify old name no longer exists
        await channelsLocators.searchInput.fill(originalName);

        const oldRow = channelsLocators.getChannelRow(originalName);

        await expect(oldRow).toHaveCount(0);

        console.log(`Updated channel: ${updatedName}`);
    });

});
