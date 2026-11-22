import { test } from '../../../fixtures/test.fixture';

import { DevicesPage } from '../../../pages/devices.page';
import { generateDeviceData } from './device-test-data';

test.describe('Administration - Devices - Create', () => {

    let devicesPage: DevicesPage;

    test.beforeEach(async ({ page }) => {
        devicesPage = new DevicesPage(page);
        await devicesPage.gotoDevices();
    });

    test('should register a new active MAG device', async () => {
        const deviceData = generateDeviceData();

        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );
    });

    test('should register an Android TV device', async () => {
        const deviceData = generateDeviceData({
            deviceType: 'Android TV',
            deviceOs: 'Android',
        });

        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );
    });

    test('should register an Android Phone device', async () => {
        const deviceData = generateDeviceData({
            deviceType: 'Android Phone',
            deviceOs: 'Android',
        });

        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );
    });
});