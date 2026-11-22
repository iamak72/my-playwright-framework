
import { faker } from '@faker-js/faker';
import type { StorageFormData } from '../../../pages/storage.page';

export function createStorageTestData(): StorageFormData {
  const id = faker.string.alphanumeric(8).toUpperCase();

  return {
    title: `AUTO_STORAGE_${id}`,
    kind: 'Local or network folder',
    folderPath: `D:\\media\\AUTO_${id}`,
    active: true,
    useFor: ['Source files', 'Stream output'],
    playbackUrlBase: `https://stream.example.com/${id}`,
    maximumUsers: faker.number.int({ min: 10, max: 100 }),
    recording: 'Not allowed',
  };
}

export function createUpdatedStorageData(
  existingData: StorageFormData
): StorageFormData {
  const id = faker.string.alphanumeric(8).toUpperCase();

  return {
    ...existingData,
    title: `UPDATED_STORAGE_${id}`,
    folderPath: `D:\\media\\UPDATED_${id}`,
    maximumUsers: faker.number.int({ min: 101, max: 300 }),
    recording: 'Stalker DVR',
  };
}
