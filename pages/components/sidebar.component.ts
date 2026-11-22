
import { Page } from '@playwright/test';

import { BaseActions } from '../base.actions';

export class SidebarComponent {

    private readonly actions: BaseActions;

    constructor(page: Page) {
        this.actions = new BaseActions(page);
    }

    // Click any sidebar menu item
    async clickMenuItem(selector: string): Promise<void> {
        await this.actions.click(selector);
    }

    // Check whether a sidebar menu item is visible
    async isMenuItemVisible(selector: string): Promise<boolean> {
        return await this.actions.isVisible(selector);
    }

    // Check whether a sidebar menu item is enabled
    async isMenuItemEnabled(selector: string): Promise<boolean> {
        return await this.actions.isEnabled(selector);
    }

    // Wait until a sidebar menu item is visible
    async waitForMenuItem(selector: string): Promise<void> {
        await this.actions.waitForVisible(selector);
    }

}
