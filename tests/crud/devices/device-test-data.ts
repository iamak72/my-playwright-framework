import { faker } from '@faker-js/faker';
import { DeviceFormData } from '../../../pages/devices.page';

export function generateMacAddress(): string {
    return Array.from(
        { length: 6 },
        () =>
            faker.number
                .int({ min: 0, max: 255 })
                .toString(16)
                .padStart(2, '0')
                .toUpperCase(),
    ).join(':');
}

export function generateDeviceData(
    overrides: Partial<DeviceFormData> = {},
): DeviceFormData {
    const account = process.env.PW_DEVICE_ACCOUNT;

    if (!account) {
        throw new Error(
            'PW_DEVICE_ACCOUNT is missing. Set it to an existing subscriber account.',
        );
    }

    return {
        account,
        deviceType: 'MAG',
        deviceOs: 'Linux',
        identifier: generateMacAddress(),
        isActive: true,
        ...overrides,
    };
}