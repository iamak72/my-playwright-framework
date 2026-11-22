
import { test, expect } from '../../fixtures/test.fixture';
import { LoginLocators } from '../../locators';
import { ForgotPasswordLocators } from '../../locators/forgot-password.locators';

test.describe('Forgot Password Feature', () => {

    test.beforeEach(async ({ loginPage, page }) => {

        // Open login page
        await loginPage.navigateTo(
            '/Account/Login?ReturnUrl=%2F'
        );

        // Navigate to Forgot Password
        await page.locator(
            LoginLocators.forgotPasswordLink
        ).click();

        test('User should navigate back to Sign In page', async ({
            page,
            forgotPasswordPage
        }) => {

            // Step 1: Click Back to Sign In
            await forgotPasswordPage.backToSignIn();

            // Step 2: Verify login page URL
            await expect(page).toHaveURL(
                /Account\/Login/i
            );

        });


    });

    test('User should navigate to Forgot Password page', async ({
        page
    }) => {

        await expect(page).toHaveURL(
            /ForgotPassword/i
        );

    });

    test('Email field should be required', async ({ page }) => {

        // Locate email or username field
        const emailInput = page.locator(
            ForgotPasswordLocators.emailOrUsernameInput
        );

        // Verify field is empty
        await expect(emailInput).toHaveValue('');

        // Click Send Reset Link
        await page.locator(
            ForgotPasswordLocators.sendResetLinkButton
        ).click();

        // Verify browser native validation
        const isRequired = await emailInput.evaluate(
            (element: HTMLInputElement) => {
                return element.validity.valueMissing;
            }
        );

        expect(isRequired).toBe(true);

    });

});
