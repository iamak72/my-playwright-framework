
import { test } from '../../../fixtures/test.fixture';
import { StreamingServersPage } from '../../../pages/streaming-servers.page';
import {
  createStreamingServerTestData,
  createUpdatedStreamingServerData,
} from './streaming-server-test-data';

test.describe('Streaming Servers - Update', () => {
  test('should update an existing streaming server', async ({ page }) => {
    const streamingServersPage = new StreamingServersPage(page);

    const originalData = createStreamingServerTestData();
    const updatedData = createUpdatedStreamingServerData(originalData);

    await streamingServersPage.gotoStreamingServers();

    await test.step('Create original server', async () => {
      await streamingServersPage.createStreamingServer(originalData);
    });

    await test.step('Update server information', async () => {
      await streamingServersPage.updateStreamingServer(
        originalData.title,
        updatedData
      );
    });

    await test.step('Verify updated server details', async () => {
      await streamingServersPage.verifyServerDetails(updatedData);
      await streamingServersPage.verifyServerNotVisible(originalData.title);
    });
  });
});
