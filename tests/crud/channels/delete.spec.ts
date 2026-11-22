
import { test, expect } from '../../../fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { ChannelsLocators } from '../../../locators/channels.locators';

test.describe('Channels - Delete', () => {

    test('should delete an existing channel successfully', async ({ page }) => {

        const channelsLocators = new ChannelsLocators(page);

        const channelName = `Delete_Channel_${faker.string.alphanumeric(8)}`;

        // Navigate to Channels
        await page.goto('/live-tv');

        // Create test channel
        await channelsLocators.addChannelButton.click();

        await channelsLocators.channelNameInput.fill(channelName);

        await channelsLocators.saveChannelButton.click();

        // Return to listing
        await page.goto('/live-tv');

        // Search channel
        await channelsLocators.searchInput.fill(channelName);

        const channelRow = channelsLocators.getChannelRow(channelName);

        // Verify channel exists
        await expect(channelRow).toBeVisible();

        // Click delete
        await channelsLocators.getDeleteButton(channelRow).click();

        // Verify confirmation dialog
        await expect(
            channelsLocators.confirmationDialog
        ).toBeVisible();

        // Confirm deletion
        await channelsLocators.confirmDeleteButton.click();

        // Verify dialog closes
        await expect(
            channelsLocators.confirmationDialog
        ).toBeHidden();

        // Verify channel removed
        await expect(channelRow).toHaveCount(0);

        console.log(`Deleted channel: ${channelName}`);
    });

});
