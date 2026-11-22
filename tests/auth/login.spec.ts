
import { test, expect } from '../../fixtures/test.fixture';
import { TestData } from '../../data/test-data';

for (const user of TestData.login.allLoginUsers) {

    test(`Login - ${user.scenario}`, async ({ page, loginPage }) => {

        // Step 1: Open login page
        await loginPage.navigateTo(
            '/Account/Login?ReturnUrl=%2F'
        );

        // Step 2: Enter credentials and login
        await loginPage.login(
            user.email,
            user.password
        );

        // Step 3: Verify expected result
        if (user.expectedResult === 'success') {

            await expect(page).toHaveURL(/\/dashboard/);

        } else {

            await expect(
                page.locator('.error-message')
            ).toBeVisible();

        }

    });

}
