
import { test } from '../../../fixtures/test.fixture';
import { StreamingServersPage } from '../../../pages/streaming-servers.page';
import { createStreamingServerTestData } from './streaming-server-test-data';

test.describe('Streaming Servers - Create', () => {
  test('should create a new streaming server', async ({ page }) => {
    const streamingServersPage = new StreamingServersPage(page);
    const serverData = createStreamingServerTestData();

    await test.step('Navigate to Streaming Servers', async () => {
      await streamingServersPage.gotoStreamingServers();
    });

    await test.step('Create streaming server', async () => {
      await streamingServersPage.createStreamingServer(serverData);
    });

    await test.step('Verify created server details', async () => {
      await streamingServersPage.verifyServerDetails(serverData);
    });
  });
});
