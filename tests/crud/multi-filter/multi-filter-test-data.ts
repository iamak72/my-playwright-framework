
import { faker } from '@faker-js/faker';
import { MultiFilterFormData } from '../../../pages/multi-filter.page';

export function generateFilterName(): string {
  return `Auto_Filter_${faker.string.alphanumeric(8)}`;
}

export function generateFilterData(
  overrides: Partial<MultiFilterFormData> = {},
): MultiFilterFormData {
  return {
    name: generateFilterName(),
    description: `Automated test filter ${faker.lorem.sentence()}`,
    isPreset: false,
    category: 'Account group',
    matchCriteria: 'All rules',
    rules: [
      {
        field: 'Account status',
        condition: 'is',
        value: 'Active',
      },
    ],
    ...overrides,
  };
}
