
import { faker } from '@faker-js/faker';

import {
  test,
  expect,
} from '../../../fixtures/test.fixture';

import { EpgSourceData } from '../../../pages/epg.page';

test.describe('EPG Sources - Read', () => {
  test.beforeEach(async ({ epgPage }) => {
    await epgPage.gotoEpgPage();
  });

  test('should search and read EPG source details', async ({
    epgPage,
  }) => {
    const uniqueId = faker.string.alphanumeric(8).toLowerCase();

    const source: EpgSourceData = {
      url: `https://example.com/read-${uniqueId}.xml`,
      prefix: `read_${uniqueId}`,
      initialState: 'Draft',
      languages: ['English'],
    };

    // Create source for read verification
    await epgPage.clickAddSource();

    await epgPage.fillSourceForm(source);

    await epgPage.submitSource();

    // Search source
    await epgPage.searchSource(source.prefix);

    // Verify source exists
    await expect(
      epgPage.getSourceRow(source.prefix)
    ).toBeVisible();

    expect(
      await epgPage.isSourcePresent(source.prefix)
    ).toBe(true);

    // Verify source metadata
    await epgPage.verifySourceDetails(source);

    // Verify row contains the expected state
    await expect(
      epgPage.getSourceRow(source.prefix)
    ).toContainText('Draft');
  });
});
