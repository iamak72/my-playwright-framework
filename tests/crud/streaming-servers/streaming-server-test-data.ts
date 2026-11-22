
import { faker } from '@faker-js/faker';
import type { StreamingServerFormData } from '../../../pages/streaming-servers.page';

export function createStreamingServerTestData(): StreamingServerFormData {
  const id = faker.string.alphanumeric(8).toLowerCase();

  return {
    title: `AUTO_STREAM_${id.toUpperCase()}`,
    host: `stream-${id}.example.com`,
    role: 'None',
    maximumUsers: faker.number.int({ min: 50, max: 500 }),

    country: 'PK',
    latitude: 31.5204,
    longitude: 74.3587,

    hlsBaseUrl: `https://stream-${id}.example.com/hls`,
    statUrl: `https://stream-${id}.example.com/stat`,
    secureLinkSecret: faker.string.alphanumeric(32),

    enabled: true,
    bindSignedUrls: true,

    accountGroups: ['LAHORE', 'KARACHI'],
  };
}

export function createUpdatedStreamingServerData(
  original: StreamingServerFormData
): StreamingServerFormData {
  const id = faker.string.alphanumeric(8).toLowerCase();

  return {
    ...original,
    title: `UPDATED_STREAM_${id.toUpperCase()}`,
    host: `updated-${id}.example.com`,
    maximumUsers: faker.number.int({ min: 501, max: 1000 }),
    hlsBaseUrl: `https://updated-${id}.example.com/hls`,
    accountGroups: ['ISLAMABAD'],
  };
}
