
import { faker } from '@faker-js/faker';
import {
  AdvertisementFormData,
  CampaignFormData,
} from '../../../pages/ads-avod.page';

export function generateCampaignName(): string {
  return `Auto_AVOD_${faker.string.alphanumeric(8)}`;
}

export function generateAdvertisementHeading(): string {
  return `Auto_Ad_${faker.string.alphanumeric(8)}`;
}

export function generateCampaignData(
  overrides: Partial<CampaignFormData> = {},
): CampaignFormData {
  return {
    name: generateCampaignName(),
    type: 'Pre-roll',
    duration: '15s',
    budget: faker.number.int({
      min: 100,
      max: 10000,
    }),
    status: 'Active',
    ...overrides,
  };
}

export function generateAdvertisementData(
  campaignName: string,
  overrides: Partial<AdvertisementFormData> = {},
): AdvertisementFormData {
  return {
    type: 'Advertisement',
    heading: generateAdvertisementHeading(),
    campaign: campaignName,
    description: `Automated advertisement ${faker.lorem.sentence()}`,
    platforms: ['Mobile', 'TV'],
    frequency: 'Daily',
    targetAudience: 'All accounts',
    priority: faker.number.int({
      min: 1,
      max: 10,
    }),
    ...overrides,
  };
}

export function generateUpdatedCampaignData(
  overrides: Partial<CampaignFormData> = {},
): CampaignFormData {
  return generateCampaignData({
    name: generateCampaignName(),
    type: 'Sponsorship',
    duration: '60s',
    budget: faker.number.int({
      min: 10000,
      max: 50000,
    }),
    status: 'Active',
    ...overrides,
  });
}

export function generateUpdatedAdvertisementData(
  campaignName: string,
  overrides: Partial<AdvertisementFormData> = {},
): AdvertisementFormData {
  return generateAdvertisementData(campaignName, {
    heading: generateAdvertisementHeading(),
    description: `Updated advertisement ${faker.lorem.sentence()}`,
    type: 'Notification',
    platforms: ['Web'],
    frequency: 'Weekly',
    priority: faker.number.int({
      min: 1,
      max: 10,
    }),
    ...overrides,
  });
}
