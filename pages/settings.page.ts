
import { Page } from '@playwright/test';

import { BasePage } from './base.page';
import { SidebarComponent } from './components/sidebar.component';

import { SidebarLocators } from '../locators/sidebar.locators';

export class SettingsPage extends BasePage {

    private readonly sidebar: SidebarComponent;

    constructor(page: Page) {
        super(page);

        this.sidebar = new SidebarComponent(page);
    }

    // Navigate to any module from Settings page
    async openMenuItem(selector: string): Promise<void> {
        await this.sidebar.clickMenuItem(selector);
    }

    // Open Dashboard
    async openDashboard(): Promise<void> {
        await this.sidebar.clickMenuItem(
            SidebarLocators.dashboardLink
        );
    }

    // Check sidebar item visibility
    async isSidebarMenuItemVisible(
        selector: string
    ): Promise<boolean> {
        return await this.sidebar.isMenuItemVisible(selector);
    }

    // Check sidebar item enabled state
    async isSidebarMenuItemEnabled(
        selector: string
    ): Promise<boolean> {
        return await this.sidebar.isMenuItemEnabled(selector);
    }

}
