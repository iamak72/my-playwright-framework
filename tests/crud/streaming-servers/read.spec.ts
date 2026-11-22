
import { test } from '../../../fixtures/test.fixture';
import { StreamingServersPage } from '../../../pages/streaming-servers.page';
import { createStreamingServerTestData } from './streaming-server-test-data';

test.describe('Streaming Servers - Read', () => {
  test('should read and verify an existing streaming server', async ({ page }) => {
    const streamingServersPage = new StreamingServersPage(page);
    const serverData = createStreamingServerTestData();

    await streamingServersPage.gotoStreamingServers();

    await test.step('Create test server', async () => {
      await streamingServersPage.createStreamingServer(serverData);
    });

    await test.step('Find the server in listing', async () => {
      await streamingServersPage.searchServer(serverData.title);
      await streamingServersPage.verifyServerVisible(serverData.title);
    });

    await test.step('Verify server details', async () => {
      await streamingServersPage.verifyServerDetails(serverData);
    });
  });
});
