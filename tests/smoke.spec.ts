
import { test, expect } from '@playwright/test';

test('Verify Chromium browser launch', async ({ page }) => {

    await page.goto('https://example.com');

    await expect(page).toHaveTitle(/Example Domain/);

    console.log('Browser launched successfully!');
});
