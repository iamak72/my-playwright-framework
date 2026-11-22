export const GenreSelectors = {
    route: process.env.PW_GENRES_PATH ?? '/Genres',

    listing: {
        addGenre: [
            '[data-testid="add-genre"]',
            'button:has-text("+ Add genre")',
            'button:has-text("Add genre")',
        ],

        search: [
            '[data-testid="genre-search"]',
            'input[placeholder="Search genres"]',
            'input[aria-label="Search genres"]',
        ],

        reorder: [
            '[data-testid="reorder-genres"]',
            'button:has-text("Reorder")',
        ],

        table: [
            '[data-testid="genres-table"]',
            'table',
        ],

        rows: [
            '[data-testid="genre-row"]',
            'table tbody tr',
        ],

        emptyState: [
            '[data-testid="empty-state"]',
            '.empty-state',
            '.no-data',
        ],
    },

    modal: {
        root: [
            '[data-testid="genre-modal"]',
            '[role="dialog"]',
            '.modal.show',
            '.modal[open]',
        ],

        name: [
            '[data-testid="genre-name"]',
            'input[name="Name"]',
            'input[name="name"]',
            'input[placeholder="Genre name"]',
            'input[aria-label="Genre name"]',
        ],

        english: [
            '[data-testid="genre-translation-en"]',
            'input[name="English"]',
            'input[name="EnglishGB"]',
            'input[name="translations.en"]',
            'input[placeholder*="English"]',
        ],

        spanish: [
            '[data-testid="genre-translation-es"]',
            'input[name="Spanish"]',
            'input[name="SpanishES"]',
            'input[name="translations.es"]',
            'input[placeholder*="Spanish"]',
        ],

        categories: {
            Cartoons: [
                '[data-testid="category-cartoons"] input[type="checkbox"]',
                'input[type="checkbox"][value="Cartoons"]',
                'label:has-text("Cartoons") input[type="checkbox"]',
            ],

            Movies: [
                '[data-testid="category-movies"] input[type="checkbox"]',
                'input[type="checkbox"][value="Movies"]',
                'label:has-text("Movies") input[type="checkbox"]',
            ],

            Islamic: [
                '[data-testid="category-islamic"] input[type="checkbox"]',
                'input[type="checkbox"][value="Islamic"]',
                'label:has-text("Islamic") input[type="checkbox"]',
            ],

            'TV Shows': [
                '[data-testid="category-tv-shows"] input[type="checkbox"]',
                'input[type="checkbox"][value="TV Shows"]',
                'label:has-text("TV Shows") input[type="checkbox"]',
            ],
        },

        ageRestricted: [
            '[data-testid="genre-age-restricted"] input[type="checkbox"]',
            'input[name="AgeRestricted"]',
            'input[name="ageRestricted"]',
            'input[name="IsAgeRestricted"]',
            'label:has-text("hidden behind the parental PIN") input[type="checkbox"]',
        ],

        save: [
            '[data-testid="save-genre"]',
            'button:has-text("Save")',
        ],

        cancel: [
            '[data-testid="cancel-genre"]',
            'button:has-text("Cancel")',
        ],

        close: [
            '[data-testid="close-genre-modal"]',
            'button[aria-label="Close"]',
            'button[title="Close"]',
            '.modal .btn-close',
        ],
    },

    rowActions: {
        edit: [
            '[data-testid="edit-genre"]',
            'button[aria-label="Edit"]',
            'button[title="Edit"]',
            'a[title="Edit"]',
            'button:has(svg[data-icon="pencil"])',
        ],

        delete: [
            '[data-testid="delete-genre"]',
            'button[aria-label="Delete"]',
            'button[title="Delete"]',
            'a[title="Delete"]',
            'button:has(svg[data-icon="trash"])',
        ],
    },

    confirmation: {
        dialog: [
            '[data-testid="delete-confirmation"]',
            '[role="alertdialog"]',
            '.modal.show',
        ],

        confirm: [
            '[data-testid="confirm-delete"]',
            'button:has-text("Delete")',
            'button:has-text("Confirm")',
        ],

        cancel: [
            '[data-testid="cancel-delete"]',
            'button:has-text("Cancel")',
        ],
    },

    feedback: {
        success: [
            '[data-testid="success-message"]',
            '[role="status"]',
            '.toast-success',
            '.alert-success',
        ],

        error: [
            '[data-testid="error-message"]',
            '[role="alert"]',
            '.toast-error',
            '.alert-danger',
        ],
    },
} as const;

export type GenreCategory = keyof typeof GenreSelectors.modal.categories;