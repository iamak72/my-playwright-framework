
import {
    Page,
    Locator,
    expect,
} from '@playwright/test';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a route using the configured Playwright page.
     */
    async navigateTo(path: string): Promise<void> {
        await this.page.goto(path, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Reusable navigation method for application modules.
     * Module pages should use this instead of implementing
     * their own page.goto() navigation logic.
     */
    async navigateToModule(path: string): Promise<void> {
        await this.navigateTo(path);
        await this.waitForPageLoad();
    }

    async waitForElement(
        locator: Locator,
        timeout = 10000,
    ): Promise<void> {
        await locator.waitFor({
            state: 'visible',
            timeout,
        });
    }

    async waitForElementHidden(
        locator: Locator,
        timeout = 10000,
    ): Promise<void> {
        await locator.waitFor({
            state: 'hidden',
            timeout,
        });
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    async verifyHidden(locator: Locator): Promise<void> {
        await expect(locator).toBeHidden();
    }

    getCurrentUrl(): string {
        return this.page.url();
    }

    getCurrentURL(): string {
        return this.getCurrentUrl();
    }

    getPage(): Page {
        return this.page;
    }

    async openSidebarMenuItem(menuItem: string): Promise<void> {
        const menuLocator = this.page
            .getByText(menuItem, { exact: true })
            .first();

        await menuLocator.waitFor({
            state: 'visible',
            timeout: 10000,
        });

        await menuLocator.click();
    }
}
