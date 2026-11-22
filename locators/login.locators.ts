
export const LoginLocators = {

    // Login form fields
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',

    // Login actions
    loginButton: 'button[type="submit"]',

    // Login messages
    errorMessage: '.error-message',

    // Additional links
    forgotPasswordLink: 'a[href*="forgot-password"]'

} as const;
