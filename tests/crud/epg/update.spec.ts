
import { faker } from '@faker-js/faker';

import {
  test,
  expect,
} from '../../../fixtures/test.fixture';

import { EpgSourceData } from '../../../pages/epg.page';

test.describe('EPG Sources - Update', () => {
  test.beforeEach(async ({ epgPage }) => {
    await epgPage.gotoEpgPage();
  });

  test('should update an existing EPG source prefix', async ({
    epgPage,
  }) => {
    const uniqueId = faker.string.alphanumeric(8).toLowerCase();

    const originalSource: EpgSourceData = {
      url: `https://example.com/update-${uniqueId}.xml`,
      prefix: `old_${uniqueId}`,
      initialState: 'Draft',
    };

    const updatedPrefix = `new_${uniqueId}`;

    // Create original source
    await epgPage.clickAddSource();

    await epgPage.fillSourceForm(originalSource);

    await epgPage.submitSource();

    // Search original source
    await epgPage.searchSource(originalSource.prefix);

    await expect(
      epgPage.getSourceRow(originalSource.prefix)
    ).toBeVisible();

    // Update source prefix
    await epgPage.editSourcePrefix(
      originalSource.prefix,
      updatedPrefix
    );

    // Search updated source
    await epgPage.searchSource(updatedPrefix);

    // Verify updated prefix
    await expect(
      epgPage.getSourceRow(updatedPrefix)
    ).toBeVisible();

    await expect(
      epgPage.getSourceRow(updatedPrefix)
    ).toContainText(updatedPrefix);

    // Verify old prefix is no longer present
    await expect(
      epgPage.getSourceRow(originalSource.prefix)
    ).toHaveCount(0);
  });
});
