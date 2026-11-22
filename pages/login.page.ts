
import { Page } from '@playwright/test';

import { BasePage } from './base.page';
import { BaseActions } from './base.actions';

import { LoginLocators } from '../locators';

export class LoginPage extends BasePage {

    private readonly actions: BaseActions;

    constructor(page: Page) {
        super(page);
        this.actions = new BaseActions(page);
    }

    // Enter email
    async enterEmail(email: string): Promise<void> {
        await this.actions.fill(
            LoginLocators.emailInput,
            email
        );
    }

    // Enter password
    async enterPassword(password: string): Promise<void> {
        await this.actions.fill(
            LoginLocators.passwordInput,
            password
        );
    }

    // Click login button
    async clickLogin(): Promise<void> {
        await this.actions.click(
            LoginLocators.loginButton
        );
    }

    // Complete login process
    async login(email: string, password: string): Promise<void> {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    // Get login error message
    async getErrorMessage(): Promise<string | null> {
        return await this.actions.getText(
            LoginLocators.errorMessage
        );
    }

    // Check error message visibility
    async isErrorMessageVisible(): Promise<boolean> {
        return await this.actions.isVisible(
            LoginLocators.errorMessage
        );
    }

    // Get current page URL
    async getLoginPageURL(): Promise<string> {
        return await this.getCurrentURL();
    }
}
