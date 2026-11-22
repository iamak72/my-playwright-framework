
import { faker } from '@faker-js/faker';

import {
  test,
  expect,
} from '../../../fixtures/test.fixture';

import { EpgSourceData } from '../../../pages/epg.page';

test.describe('EPG Sources - Create', () => {
  test.beforeEach(async ({ epgPage }) => {
    await epgPage.gotoEpgPage();
  });

  test('should create a new EPG source successfully', async ({
    epgPage,
  }) => {
    const uniqueId = faker.string.alphanumeric(8).toLowerCase();

    const source: EpgSourceData = {
      url: `https://example.com/epg-${uniqueId}.xml`,
      prefix: `epg_${uniqueId}`,
      initialState: 'Draft',
      languages: ['English'],
    };

    // Open Add Source panel
    await epgPage.clickAddSource();

    // Fill EPG source form
    await epgPage.fillSourceForm(source);

    // Submit source
    await epgPage.submitSource();

    // Search newly created source
    await epgPage.searchSource(source.prefix);

    // Verify source appears in the grid
    await expect(
      epgPage.getSourceRow(source.prefix)
    ).toBeVisible();

    // Verify source metadata
    await epgPage.verifySourceDetails(source);
  });
});
