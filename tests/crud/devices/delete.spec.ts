import { test } from '../../../fixtures/test.fixture';

import { DevicesPage } from '../../../pages/devices.page';
import { generateDeviceData } from './device-test-data';

test.describe('Administration - Devices - Delete', () => {

    let devicesPage: DevicesPage;

    test.beforeEach(async ({ page }) => {
        devicesPage = new DevicesPage(page);
        await devicesPage.gotoDevices();
    });

    test('should delete a registered device', async () => {
        const deviceData = generateDeviceData();

        // Arrange: create a dedicated device for this test.
        await devicesPage.registerDevice(deviceData);

        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceVisible(
            deviceData.identifier,
        );

        // Act: delete the device.
        await devicesPage.deleteDevice(deviceData.identifier);

        // Assert: the device should no longer exist.
        await devicesPage.clearSearch();
        await devicesPage.searchDevice(deviceData.identifier);

        await devicesPage.verifyDeviceNotVisible(
            deviceData.identifier,
        );
    });
});