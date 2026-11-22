
import { faker } from '@faker-js/faker';

import {
  test,
  expect,
} from '../../../fixtures/test.fixture';

import { EpgSourceData } from '../../../pages/epg.page';

test.describe('EPG Sources - Delete', () => {
  test.beforeEach(async ({ epgPage }) => {
    await epgPage.gotoEpgPage();
  });

  test('should remove an existing EPG source successfully', async ({
    epgPage,
  }) => {
    const uniqueId = faker.string.alphanumeric(8).toLowerCase();

    const source: EpgSourceData = {
      url: `https://example.com/delete-${uniqueId}.xml`,
      prefix: `delete_${uniqueId}`,
      initialState: 'Draft',
    };

    // Create source
    await epgPage.clickAddSource();

    await epgPage.fillSourceForm(source);

    await epgPage.submitSource();

    // Search source
    await epgPage.searchSource(source.prefix);

    // Verify source exists before deletion
    await expect(
      epgPage.getSourceRow(source.prefix)
    ).toBeVisible();

    // Remove source
    await epgPage.deleteSource(source.prefix);

    // Verify removal
    await epgPage.verifySourceDeleted(source.prefix);
  });
});
