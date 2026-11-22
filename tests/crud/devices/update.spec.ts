import { test, expect } from '../../../fixtures/test.fixture';

import { DevicesPage } from '../../../pages/devices.page';
import { generateDeviceData } from './device-test-data';

test.describe('Administration - Devices - Update', () => {

    let devicesPage: DevicesPage;

    test.beforeEach(async ({ page }) => {
        devicesPage = new DevicesPage(page);
        await devicesPage.gotoDevices();
    });

    test('should update device OS from Linux to Android', async () => {
        const deviceData = generateDeviceData({
            deviceType: 'MAG',
            deviceOs: 'Linux',
        });

        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );

        await devicesPage.updateDevice(
            deviceData.identifier,
            {
                deviceOs: 'Android',
            },
        );

        await devicesPage.searchDevice(deviceData.identifier);

        const updatedRow = await devicesPage.getDeviceRow(
            deviceData.identifier,
        );

        await expect(updatedRow).toBeVisible();
        await expect(updatedRow).toContainText('Android');
    });

    test('should deactivate an active device', async () => {
        const deviceData = generateDeviceData({
            isActive: true,
        });

        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );

        await devicesPage.updateDevice(
            deviceData.identifier,
            {
                isActive: false,
            },
        );

        await devicesPage.searchDevice(deviceData.identifier);

        const updatedRow = await devicesPage.getDeviceRow(
            deviceData.identifier,
        );

        await expect(updatedRow).toBeVisible();
        await expect(updatedRow).toContainText(/Inactive|Disabled/i);
    });
});