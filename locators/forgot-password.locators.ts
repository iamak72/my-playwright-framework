
export const ForgotPasswordLocators = {

    // Email or username field
    emailOrUsernameInput: 'input',

    // Reset password button
    sendResetLinkButton: 'button:has-text("Send reset link")',

    // Back to sign in link
    backToSignInLink: 'a:has-text("Back to sign in")'

} as const;
