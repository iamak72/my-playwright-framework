
import { Page, Locator } from '@playwright/test';

import { BasePage } from './base.page';
import { SidebarComponent } from './components/sidebar.component';

import { SidebarLocators } from '../locators/sidebar.locators';
import { ChannelsLocators } from '../locators/channels.locators';

export class ChannelsPage extends BasePage {

    private readonly sidebar: SidebarComponent;
    private readonly channelsLocators: ChannelsLocators;

    constructor(page: Page) {
        super(page);

        this.sidebar = new SidebarComponent(page);
        this.channelsLocators = new ChannelsLocators(page);
    }

    // ==========================================
    // SIDEBAR OPERATIONS
    // ==========================================

    async openMenuItem(selector: string): Promise<void> {
        await this.sidebar.clickMenuItem(selector);
    }

    async openDashboard(): Promise<void> {
        await this.sidebar.clickMenuItem(
            SidebarLocators.dashboardLink
        );
    }

    async isSidebarMenuItemVisible(
        selector: string
    ): Promise<boolean> {
        return await this.sidebar.isMenuItemVisible(selector);
    }

    async isSidebarMenuItemEnabled(
        selector: string
    ): Promise<boolean> {
        return await this.sidebar.isMenuItemEnabled(selector);
    }

    // ==========================================
    // CHANNELS NAVIGATION
    // ==========================================

    async navigateToChannels(): Promise<void> {
        await this.navigateTo('/live-tv');
    }

    async clickAddChannel(): Promise<void> {
        await this.channelsLocators.addChannelButton.click();
    }

    // ==========================================
    // CHANNEL FORM OPERATIONS
    // ==========================================

    async enterChannelName(name: string): Promise<void> {
        await this.channelsLocators.channelNameInput.fill(name);
    }

    async getChannelNumber(): Promise<string> {
        return await this.channelsLocators.channelNumberInput.inputValue();
    }

    async selectCategory(value: string): Promise<void> {
        await this.channelsLocators.categoryDropdown.selectOption({
            label: value
        });
    }

    async selectLanguage(value: string): Promise<void> {
        await this.channelsLocators.languagesDropdown.selectOption({
            label: value
        });
    }

    async selectVolumeCorrection(value: string): Promise<void> {
        await this.channelsLocators.volumeCorrectionDropdown.selectOption({
            label: value
        });
    }

    async setChannelStatus(enabled: boolean): Promise<void> {
        const statusToggle = this.channelsLocators.channelStatusToggle;

        const currentStatus = await statusToggle.getAttribute(
            'aria-checked'
        );

        if (currentStatus === null) {
            throw new Error(
                'Channel status switch does not expose aria-checked'
            );
        }

        if ((currentStatus === 'true') !== enabled) {
            await statusToggle.click();
        }
    }

    async saveChannel(): Promise<void> {
        await this.channelsLocators.saveChannelButton.click();
    }

    // ==========================================
    // CHANNEL SEARCH OPERATIONS
    // ==========================================

    async searchChannel(name: string): Promise<void> {
        await this.channelsLocators.searchInput.fill(name);
    }

    getChannelRow(name: string): Locator {
        return this.channelsLocators.getChannelRow(name);
    }

    // ==========================================
    // CHANNEL CRUD OPERATIONS
    // ==========================================

    async editChannel(name: string): Promise<void> {
        const row = this.getChannelRow(name);

        await this.channelsLocators.getEditButton(row).click();
    }

    async deleteChannel(name: string): Promise<void> {
        const row = this.getChannelRow(name);

        await this.channelsLocators.getDeleteButton(row).click();
    }

    async confirmDelete(): Promise<void> {
        await this.channelsLocators.confirmDeleteButton.click();
    }

    // ==========================================
    // CHANNEL VERIFICATIONS
    // ==========================================

    async isChannelVisible(name: string): Promise<boolean> {
        return await this.getChannelRow(name).isVisible();
    }

    async isChannelNumberVisible(): Promise<boolean> {
        return await this.channelsLocators.channelNumberInput.isVisible();
    }

    async getChannelName(): Promise<string> {
        return await this.channelsLocators.channelNameInput.inputValue();
    }
}
