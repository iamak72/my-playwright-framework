
import type { BrowserType } from '@playwright/test';

import {
    chromium,
    firefox,
    webkit
} from '@playwright/test';

// Supported browsers
export type SupportedBrowser =
    | 'chromium'
    | 'firefox'
    | 'webkit';

// Browser mapping
const browsers: Record<SupportedBrowser, BrowserType> = {
    chromium,
    firefox,
    webkit
};

// Get browser engine
export const getBrowser = (
    browserName: SupportedBrowser
): BrowserType => {
    return browsers[browserName];
};
