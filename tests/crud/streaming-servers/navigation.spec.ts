
import { test } from '../../../fixtures/test.fixture';
import { StreamingServersPage } from '../../../pages/streaming-servers.page';

test.describe('Streaming Servers - Navigation', () => {
  test('should navigate to Streaming Servers module', async ({ page }) => {
    const streamingServersPage = new StreamingServersPage(page);

    await streamingServersPage.gotoStreamingServers();
    await streamingServersPage.verifyStreamingServersPage();
  });

  test('should display all overview metrics', async ({ page }) => {
    const streamingServersPage = new StreamingServersPage(page);

    await streamingServersPage.gotoStreamingServers();
    await streamingServersPage.verifyOverviewMetrics();
  });
});
