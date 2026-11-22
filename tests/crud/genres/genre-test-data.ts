import { faker } from '@faker-js/faker';

import {
    GenreFormData,
    GenreCategory,
} from '../../../pages/genres.page';

export function generateGenreName(): string {
    return `Auto_Genre_${faker.string.alphanumeric(8)}`;
}

export function generateGenreData(
    overrides: Partial<GenreFormData> = {},
): GenreFormData {
    const categories: GenreCategory[] = [
        'Cartoons',
        'Movies',
    ];

    return {
        name: generateGenreName(),

        english: `English ${faker.word.adjective()}`,

        spanish: `Spanish ${faker.word.adjective()}`,

        categories,

        ageRestricted: false,

        ...overrides,
    };
}