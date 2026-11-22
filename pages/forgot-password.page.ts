
import { Page } from '@playwright/test';

import { BasePage } from './base.page';
import { BaseActions } from './base.actions';

import { ForgotPasswordLocators } from '../locators/forgot-password.locators';

export class ForgotPasswordPage extends BasePage {

    private readonly actions: BaseActions;

    constructor(page: Page) {
        super(page);
        this.actions = new BaseActions(page);
    }

    // Enter email or username
    async enterEmailOrUsername(
        emailOrUsername: string
    ): Promise<void> {
        await this.actions.fill(
            ForgotPasswordLocators.emailOrUsernameInput,
            emailOrUsername
        );
    }

    // Check whether email or username field is empty
    async isEmailOrUsernameEmpty(): Promise<boolean> {
        const value = await this.actions.getInputValue(
            ForgotPasswordLocators.emailOrUsernameInput
        );

        return value.trim() === '';
    }

    // Click Send Reset Link button
    async clickSendResetLink(): Promise<void> {
        await this.actions.click(
            ForgotPasswordLocators.sendResetLinkButton
        );
    }

    // Click Back to Sign In
    async backToSignIn(): Promise<void> {
        await this.actions.click(
            ForgotPasswordLocators.backToSignInLink
        );
    }
}
