import { test, expect } from '../../../fixtures/test.fixture';

import { BasePage } from '../../../pages/base.page';
import { DevicesPage } from '../../../pages/devices.page';
import { DeviceSelectors } from '../../../locators/device.selectors';

test.describe('Administration - Devices - Navigation', () => {

    test('should navigate to Devices using BasePage', async ({ page }) => {
        const basePage = new BasePage(page);

        await basePage.navigateToModule(DeviceSelectors.route);

        await expect(page).toHaveURL(
            new RegExp(
                `${DeviceSelectors.route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[/?#]|$)`,
            ),
        );

        await expect(
            page.locator(
                DeviceSelectors.listing.registerDevice.join(', '),
            ).first(),
        ).toBeVisible();
    });

    test('should navigate to Devices using DevicesPage', async ({ page }) => {
        const devicesPage = new DevicesPage(page);

        await devicesPage.gotoDevices();

        await expect(
            page.locator(
                DeviceSelectors.listing.registerDevice.join(', '),
            ).first(),
        ).toBeVisible();
    });

    test('should open Register Device modal', async ({ page }) => {
        const devicesPage = new DevicesPage(page);

        await devicesPage.gotoDevices();
        await devicesPage.openRegisterDeviceModal();

        await expect(
            devicesPage.getDeviceModal(),
        ).toBeVisible();
    });
});