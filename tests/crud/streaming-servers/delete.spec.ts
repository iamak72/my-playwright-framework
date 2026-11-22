
import { test } from '../../../fixtures/test.fixture';
import { StreamingServersPage } from '../../../pages/streaming-servers.page';
import { createStreamingServerTestData } from './streaming-server-test-data';

test.describe('Streaming Servers - Delete', () => {
  test('should delete an existing streaming server', async ({ page }) => {
    const streamingServersPage = new StreamingServersPage(page);
    const serverData = createStreamingServerTestData();

    await streamingServersPage.gotoStreamingServers();

    await test.step('Create server for deletion', async () => {
      await streamingServersPage.createStreamingServer(serverData);
    });

    await test.step('Verify server exists before deletion', async () => {
      await streamingServersPage.verifyServerVisible(serverData.title);
    });

    await test.step('Delete streaming server', async () => {
      await streamingServersPage.deleteStreamingServer(serverData.title);
    });

    await test.step('Verify server is removed', async () => {
      await streamingServersPage.verifyServerNotVisible(serverData.title);
    });
  });
});
