
import { Page } from '@playwright/test';

import { BasePage } from './base.page';
import { BaseActions } from './base.actions';

import { DashboardLocators } from '../locators';

export class DashboardPage extends BasePage {

    private readonly actions: BaseActions;

    constructor(page: Page) {
        super(page);
        this.actions = new BaseActions(page);
    }

    // Open Channels module
    async openChannels(): Promise<void> {
        await this.openSidebarMenuItem('Channels');
    }

    // Logout from application
    async logout(): Promise<void> {
        await this.actions.click(
            DashboardLocators.logoutButton
        );
    }

    // Check dashboard visibility
    async isDashboardVisible(): Promise<boolean> {
        return await this.actions.isVisible(
            DashboardLocators.dashboardHeading
        );
    }

    // Get dashboard heading
    async getDashboardHeading(): Promise<string | null> {
        return await this.actions.getText(
            DashboardLocators.dashboardHeading
        );
    }

    // Wait for dashboard heading
    async waitForDashboard(): Promise<void> {
        await this.actions.waitForVisible(
            DashboardLocators.dashboardHeading
        );
    }

    // Get current dashboard URL
    async getDashboardURL(): Promise<string> {
        return this.getCurrentURL();
    }
}
