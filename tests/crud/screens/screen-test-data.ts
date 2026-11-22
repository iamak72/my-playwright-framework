
import { faker } from '@faker-js/faker';
import type { ScreenFormData } from '../../../pages/screens.page';

export function createScreenTestData(): ScreenFormData {
  const uniqueId = faker.string.alphanumeric(8).toUpperCase();

  return {
    internalName: `AUTO_SCREEN_${uniqueId}`,
    englishName: `Automation Screen ${uniqueId}`,
    spanishName: `Pantalla ${uniqueId}`,

    active: true,
    isDefault: false,

    mode: 'Dark',
    accentColor: 'blue',

    backgroundType: 'Colour',
    backgroundColor: '#1E40AF',

    deviceTypes: ['TV Box', 'Mobile'],
    accountGroups: ['KARACHI'],

    // Optional: Set this to an existing filter name
    // when the application requires a device multi-filter.
    deviceFilter: undefined,
  };
}

export function createUpdatedScreenData(
  current: ScreenFormData,
): ScreenFormData {
  const uniqueId = faker.string.alphanumeric(8).toUpperCase();

  return {
    ...current,
    internalName: `UPDATED_SCREEN_${uniqueId}`,
    englishName: `Updated Screen ${uniqueId}`,
    mode: 'Light',
    accentColor: 'red',
    deviceTypes: ['TV App', 'Mobile'],
    accountGroups: ['LAHORE'],
  };
}

export function createClonedScreenName(): string {
  return `CLONED_SCREEN_${faker.string.alphanumeric(8).toUpperCase()}`;
}
