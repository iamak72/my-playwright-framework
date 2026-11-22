
import { defineConfig } from '@playwright/test';

import { ENV } from './config/environment';

export default defineConfig({

    // Test directory
    testDir: './tests',

    // Run tests in parallel
    fullyParallel: true,

    // Fail build if test.only is accidentally committed
    forbidOnly: !!process.env.CI,

    // Retry failed tests in CI
    retries: process.env.CI ? 2 : 0,

    // Worker configuration
    workers: process.env.CI ? 2 : undefined,

    // Test timeout
    timeout: ENV.TIMEOUT,

    // Assertion timeout
    expect: {
        timeout: ENV.EXPECT_TIMEOUT
    },

    // Test reporters
    reporter: [
        ['list'],
        ['html', {
            open: 'never',
            outputFolder: 'playwright-report'
        }],
        ['allure-playwright', {
            resultsDir: 'allure-results'
        }]
    ],

    // Browser configuration
    use: {
        baseURL: ENV.BASE_URL,

        browserName: ENV.BROWSER,

        headless: ENV.HEADLESS,

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'retain-on-failure',

        actionTimeout: 10000,

        navigationTimeout: 15000
    },

    // Run only selected browser
    projects: [
        {
            name: ENV.BROWSER
        }
    ]

});
