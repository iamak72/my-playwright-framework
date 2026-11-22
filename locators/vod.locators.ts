
import { Page } from '@playwright/test';

export const VodLocators = {
    // VoD Library
    searchInput: 'input[placeholder*="Title, original title"]',
    typeFilter: 'select[name="type"], [aria-label="Type filter"]',
    statusFilter: 'select[name="status"], [aria-label="Status filter"]',
    genreFilter: 'select[name="genre"], [aria-label="Genre filter"]',

    addTitleButton: 'button:has-text("Add title")',

    // Library cards / rows
    itemCard: [
        '[data-testid="vod-card"]',
        '[data-testid="content-card"]',
        '[role="row"]',
        '[role="gridcell"]',
        'article',
    ].join(', '),

    // Movie form
    movieTypeMovieButton: 'button:has-text("Movie")',
    movieTypeTvSeriesButton: 'button:has-text("TV series")',

    tmdbIdInput: 'input[name*="tmdb" i], input[placeholder*="TMDB" i]',
    retrieveButton: 'button:has-text("Retrieve")',

    titleInput: 'input[name="Title"]',
    originalTitleInput:
        'input[name="Original title"], input[name="originalTitle"]',
    descriptionInput:
        'textarea[name="Description"], textarea[name="description"]',

    // Native HTML select elements
    categorySelect: 'select[name="category"]',
    genreSelect: 'select[name="genre"], select[name="genres"]',

    trailerUrlInput:
        'input[name*="trailer" i], input[placeholder*="Trailer" i]',
    durationInput:
        'input[name*="duration" i], input[placeholder*="Duration" i]',
    countryInput: 'input[name*="country" i]',
    audioLanguagesInput: 'input[name*="language" i]',
    directorInput: 'input[name*="director" i]',

    // Age restriction buttons
    ageRestrictionNoneButton: 'button:has-text("None")',
    ageRestrictionPgButton: 'button:has-text("PG")',
    ageRestriction12Button: 'button:has-text("12")',
    ageRestriction15Button: 'button:has-text("15")',
    ageRestriction18Button: 'button:has-text("18")',

    // Form actions
    discardButton: 'button:has-text("Discard")',
    saveDraftButton: 'button:has-text("Save draft")',
    saveButton: '#save-changes, button:has-text("Save changes")',

    // Item actions
    editButton: 'button:has-text("Edit"), [aria-label="Edit"]',
    deleteButton:
        'button:has-text("Delete"), [aria-label="Delete"]',
    trashButton:
        'button:has-text("Trash"), [aria-label*="trash" i]',

    // Confirmation modal
    confirmationDialog: '[role="dialog"]',
    confirmDeleteButton: [
        '[role="dialog"] button:has-text("Delete")',
        '[role="dialog"] button:has-text("Move to trash")',
        '[role="dialog"] button:has-text("Confirm")',
    ].join(', '),
} as const;

/**
 * Returns the library card or row containing the specified title.
 */
export function getVodItemCard(page: Page, title: string) {
    return page.locator(VodLocators.itemCard)
        .filter({ hasText: title })
        .first();
}
