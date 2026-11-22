
import dotenv from 'dotenv';
import path from 'node:path';

import type { SupportedBrowser } from './browser.config';

// Load environment variables from project root
dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

// Supported environments
type TestEnvironment = 'qa' | 'staging' | 'prod';

// Read and validate environment
const rawEnvironment = (
    process.env.TEST_ENV || 'qa'
).toLowerCase();

const supportedEnvironments: TestEnvironment[] = [
    'qa',
    'staging',
    'prod'
];

if (!supportedEnvironments.includes(rawEnvironment as TestEnvironment)) {
    throw new Error(
        `Invalid TEST_ENV: ${rawEnvironment}. ` +
        `Supported environments: ${supportedEnvironments.join(', ')}`
    );
}

const testEnvironment = rawEnvironment as TestEnvironment;

// Read and validate browser
const rawBrowser = (
    process.env.BROWSER || 'chromium'
).toLowerCase();

const supportedBrowsers: SupportedBrowser[] = [
    'chromium',
    'firefox',
    'webkit'
];

if (!supportedBrowsers.includes(rawBrowser as SupportedBrowser)) {
    throw new Error(
        `Invalid BROWSER: ${rawBrowser}. ` +
        `Supported browsers: ${supportedBrowsers.join(', ')}`
    );
}

const browser = rawBrowser as SupportedBrowser;

// Environment URLs
const environmentURLs: Record<TestEnvironment, string> = {
    qa: process.env.QA_BASE_URL || '',
    staging: process.env.STAGING_BASE_URL || '',
    prod: process.env.PROD_BASE_URL || ''
};

// Centralized configuration
export const ENV = {
    TEST_ENV: testEnvironment,

    BASE_URL: environmentURLs[testEnvironment],

    BROWSER: browser,

    HEADLESS: process.env.HEADLESS !== 'false',

    TIMEOUT: Number(process.env.TIMEOUT) || 30000,

    EXPECT_TIMEOUT: Number(process.env.EXPECT_TIMEOUT) || 10000
};

// Validate base URL
if (!ENV.BASE_URL) {
    throw new Error(
        `BASE_URL is missing for ${ENV.TEST_ENV} environment`
    );
}
