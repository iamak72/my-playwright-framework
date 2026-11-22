
import { test, expect } from '../../fixtures/test.fixture';
import { TestData } from '../../data/test-data';

test.describe('Logout Feature', () => {

    test('User should be able to logout successfully', async ({
        page,
        loginPage,
        dashboardPage
    }) => {

        // Step 1: Get valid login credentials
        const user = TestData.login.validUsers[0];

        // Step 2: Open login page
        await loginPage.navigateTo(
            '/Account/Login?ReturnUrl=%2F'
        );

        // Step 3: Login with valid credentials
        await loginPage.login(
            user.email,
            user.password
        );

        // Step 4: Verify dashboard URL
        await expect(page).toHaveURL(/\/dashboard/);

        // Step 5: Logout
        await dashboardPage.logout();

        // Step 6: Verify redirect to login page
        await expect(page).toHaveURL(/\/Account\/Login/i);

    });

});
