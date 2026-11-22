import { test } from '../../../fixtures/test.fixture';

import { DevicesPage } from '../../../pages/devices.page';
import { generateDeviceData } from './device-test-data';

test.describe('Administration - Devices - Read and Search', () => {

    let devicesPage: DevicesPage;

    test.beforeEach(async ({ page }) => {
        devicesPage = new DevicesPage(page);
        await devicesPage.gotoDevices();
    });

    test('should find a device by MAC address', async () => {
        const deviceData = generateDeviceData();

        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );
    });

    test('should not display an unrelated device for unmatched search', async () => {
        const deviceData = generateDeviceData();

        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );

        const unmatchedSearch = `NO_DEVICE_${Date.now()}`;

        await devicesPage.searchDevice(unmatchedSearch);

        await devicesPage.verifyDeviceNotVisible(
            deviceData.identifier,
        );
    });
});