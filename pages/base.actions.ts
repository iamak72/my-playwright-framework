
import { Page, Locator } from '@playwright/test';

export class BaseActions {

    constructor(protected readonly page: Page) {}

    // Get locator
    private getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }

    // Click element
    async click(selector: string): Promise<void> {
        await this.getLocator(selector).click();
    }

    // Fill input field
    async fill(selector: string, value: string): Promise<void> {
        await this.getLocator(selector).fill(value);
    }

    // Clear input field
    async clear(selector: string): Promise<void> {
        await this.getLocator(selector).clear();
    }

    // Select dropdown option
    async selectOption(
        selector: string,
        value: string
    ): Promise<void> {
        await this.getLocator(selector).selectOption(value);
    }

    // Get element text
    async getText(selector: string): Promise<string | null> {
        return await this.getLocator(selector).textContent();
    }

    // Get input value
    async getInputValue(selector: string): Promise<string> {
        return await this.getLocator(selector).inputValue();
    }

    // Check element visibility
    async isVisible(selector: string): Promise<boolean> {
        return await this.getLocator(selector).isVisible();
    }

    // Check element enabled state
    async isEnabled(selector: string): Promise<boolean> {
        return await this.getLocator(selector).isEnabled();
    }

    // Wait for element visibility
    async waitForVisible(selector: string): Promise<void> {
        await this.getLocator(selector).waitFor({
            state: 'visible'
        });
    }

    // Wait for element hidden
    async waitForHidden(selector: string): Promise<void> {
        await this.getLocator(selector).waitFor({
            state: 'hidden'
        });
    }

    // Hover over element
    async hover(selector: string): Promise<void> {
        await this.getLocator(selector).hover();
    }

    // Check checkbox
    async check(selector: string): Promise<void> {
        await this.getLocator(selector).check();
    }

    // Uncheck checkbox
    async uncheck(selector: string): Promise<void> {
        await this.getLocator(selector).uncheck();
    }
}
