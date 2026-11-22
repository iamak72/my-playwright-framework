
import { faker } from '@faker-js/faker';
import {
  CategoryFormData,
} from '../../../pages/categories.page';
import {
  CategoryScope,
} from '../../../locators/category.selectors';

export function generateCategoryName(): string {
  return `Auto_Category_${faker.string.alphanumeric(8)}`;
}

export function generateCategoryOrder(): number {
  return faker.number.int({
    min: 1,
    max: 999,
  });
}

export function generateCategoryData(
  overrides: Partial<CategoryFormData> = {},
): CategoryFormData {
  return {
    name: generateCategoryName(),
    scope: 'IPTV',
    order: generateCategoryOrder(),
    ...overrides,
  };
}

export function generateUpdatedCategoryData(
  overrides: Partial<CategoryFormData> = {},
): CategoryFormData {
  const scope: CategoryScope = 'VOD';

  return {
    name: generateCategoryName(),
    scope,
    order: generateCategoryOrder(),
    ...overrides,
  };
}
