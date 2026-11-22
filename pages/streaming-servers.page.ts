
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { StreamingServerSelectors as S } from '../locators/streaming-server.selectors';

export type StreamingServerRole = 'None';

export interface StreamingServerFormData {
  title: string;
  host: string;
  role: StreamingServerRole;
  maximumUsers: number;

  country: string;
  latitude: number;
  longitude: number;

  hlsBaseUrl: string;
  statUrl: string;
  secureLinkSecret: string;

  enabled: boolean;
  bindSignedUrls: boolean;

  accountGroups: string[];
}

export class StreamingServersPage extends BasePage {
  private readonly modulePath =
    process.env.PW_STREAMING_SERVERS_PATH || '/Addons/StreamingServers';

  constructor(page: Page) {
    super(page);
  }

  // ---------------- Navigation ----------------

  async gotoStreamingServers(): Promise<void> {
    await this.navigateToModule(this.modulePath);
    await this.verifyStreamingServersPage();
  }

  async verifyStreamingServersPage(): Promise<void> {
    await expect(
      this.page.locator(S.page.heading).first()
    ).toBeVisible();
  }

  // ---------------- Helpers ----------------

  private async firstVisible(
    selectors: string[],
    parent: Page | Locator = this.page
  ): Promise<Locator> {
    for (const selector of selectors) {
      const locator = parent.locator(selector).first();

      if (
        await locator.count() > 0 &&
        await locator.isVisible()
      ) {
        return locator;
      }
    }

    throw new Error(
      `No visible element found: ${selectors.join(', ')}`
    );
  }

  private async getModal(): Promise<Locator> {
    return this.firstVisible([S.modal.root]);
  }

  private async getRow(title: string): Promise<Locator> {
    const row = this.page
      .locator(S.table.rows)
      .filter({ hasText: title })
      .first();

    await expect(
      row,
      `Streaming server "${title}" should be visible`
    ).toBeVisible();

    return row;
  }

  private async fillInput(
    modal: Locator,
    selector: string,
    value: string
  ): Promise<void> {
    const input = modal.locator(selector).first();

    await expect(input).toBeVisible();
    await input.fill(value);
  }

  // ---------------- Dropdown ----------------

  private async selectDropdown(
    modal: Locator,
    selector: string,
    value: string
  ): Promise<void> {
    const dropdown = modal.locator(selector).first();

    await expect(dropdown).toBeVisible();

    const tagName = await dropdown.evaluate(
      element => element.tagName.toLowerCase()
    );

    if (tagName === 'select') {
      await dropdown.selectOption({ label: value });
      return;
    }

    await dropdown.click();

    const option = this.page
      .getByRole('option', { name: value, exact: true })
      .or(this.page.getByText(value, { exact: true }))
      .last();

    await expect(option).toBeVisible();
    await option.click();
  }

  // ---------------- Toggle handling ----------------

  private async setToggle(
    modal: Locator,
    selector: string,
    expectedState: boolean
  ): Promise<void> {
    const toggle = modal.locator(selector).first();

    await expect(toggle).toBeVisible();

    const tagName = await toggle.evaluate(
      element => element.tagName.toLowerCase()
    );

    if (tagName === 'input') {
      const type = await toggle.getAttribute('type');

      if (type === 'checkbox') {
        if (expectedState) {
          await toggle.check();
        } else {
          await toggle.uncheck();
        }

        await expect(toggle).toBeChecked({
          checked: expectedState,
        });

        return;
      }
    }

    const ariaChecked = await toggle.getAttribute('aria-checked');

    if (ariaChecked !== null) {
      if ((ariaChecked === 'true') !== expectedState) {
        await toggle.click();
      }

      await expect(toggle).toHaveAttribute(
        'aria-checked',
        String(expectedState)
      );

      return;
    }

    // Fallback for custom switches without exposed state.
    await toggle.click();
  }

  // ---------------- Account groups ----------------

  private async selectAccountGroups(
    modal: Locator,
    selectedGroups: string[]
  ): Promise<void> {
    const groupSelectors: Record<string, string> = {
      KARACHI: S.modal.accountGroups.karachi,
      LAHORE: S.modal.accountGroups.lahore,
      ISLAMABAD: S.modal.accountGroups.islamabad,
    };

    for (const [groupName, selector] of Object.entries(groupSelectors)) {
      const group = modal.locator(selector).first();

      if (!(await group.count())) {
        if (selectedGroups.includes(groupName)) {
          throw new Error(
            `Account group "${groupName}" was not found`
          );
        }

        continue;
      }

      const shouldBeChecked = selectedGroups.includes(groupName);

      const tagName = await group.evaluate(
        element => element.tagName.toLowerCase()
      );

      if (tagName === 'input') {
        const type = await group.getAttribute('type');

        if (type === 'checkbox') {
          if (shouldBeChecked) {
            await group.check();
          } else {
            await group.uncheck();
          }

          continue;
        }
      }

      const currentState = await group.getAttribute('aria-checked');

      if (currentState !== null) {
        if ((currentState === 'true') !== shouldBeChecked) {
          await group.click();
        }
      } else if (shouldBeChecked) {
        await group.click();
      }
    }
  }

  // ---------------- Add server ----------------

  async clickAddServer(): Promise<void> {
    const addButton = this.page.locator(S.page.addButton).first();

    await expect(addButton).toBeVisible();
    await addButton.click();

    await this.getModal();
  }

  // ---------------- Form filling ----------------

  async fillGeneralSection(
    data: StreamingServerFormData
  ): Promise<void> {
    const modal = await this.getModal();

    await this.fillInput(modal, S.modal.title, data.title);
    await this.fillInput(modal, S.modal.host, data.host);

    await this.selectDropdown(
      modal,
      S.modal.role,
      data.role
    );

    await this.fillInput(
      modal,
      S.modal.maximumUsers,
      String(data.maximumUsers)
    );
  }

  async fillLocationSection(
    data: StreamingServerFormData
  ): Promise<void> {
    const modal = await this.getModal();

    await this.fillInput(
      modal,
      S.modal.country,
      data.country
    );

    await this.fillInput(
      modal,
      S.modal.latitude,
      String(data.latitude)
    );

    await this.fillInput(
      modal,
      S.modal.longitude,
      String(data.longitude)
    );
  }

  async fillEndpointsSection(
    data: StreamingServerFormData
  ): Promise<void> {
    const modal = await this.getModal();

    await this.fillInput(
      modal,
      S.modal.hlsBaseUrl,
      data.hlsBaseUrl
    );

    await this.fillInput(
      modal,
      S.modal.statUrl,
      data.statUrl
    );

    await this.fillInput(
      modal,
      S.modal.secureLinkSecret,
      data.secureLinkSecret
    );
  }

  async fillAccessSection(
    data: StreamingServerFormData
  ): Promise<void> {
    const modal = await this.getModal();

    await this.setToggle(
      modal,
      S.modal.enabled,
      data.enabled
    );

    await this.setToggle(
      modal,
      S.modal.bindSignedUrls,
      data.bindSignedUrls
    );

    await this.selectAccountGroups(
      modal,
      data.accountGroups
    );
  }

  async fillStreamingServerForm(
    data: StreamingServerFormData
  ): Promise<void> {
    await this.fillGeneralSection(data);
    await this.fillLocationSection(data);
    await this.fillEndpointsSection(data);
    await this.fillAccessSection(data);
  }

  // ---------------- Modal actions ----------------

  async testServerConnection(): Promise<void> {
    const modal = await this.getModal();
    const testButton = modal.locator(S.modal.testButton);

    await expect(testButton).toBeVisible();
    await testButton.click();

    // Add response assertion when the actual Test result message is known.
  }

  async saveServer(): Promise<void> {
    const modal = await this.getModal();
    const saveButton = modal.locator(S.modal.saveButton);

    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(modal).toBeHidden();
  }

  async cancelServer(): Promise<void> {
    const modal = await this.getModal();

    await modal.locator(S.modal.cancelButton).click();
    await expect(modal).toBeHidden();
  }

  // ---------------- Create ----------------

  async createStreamingServer(
    data: StreamingServerFormData
  ): Promise<void> {
    await this.clickAddServer();
    await this.fillStreamingServerForm(data);
    await this.saveServer();

    await this.verifyServerVisible(data.title);
  }

  // ---------------- Read ----------------

  async verifyServerVisible(title: string): Promise<void> {
    await expect(await this.getRow(title)).toBeVisible();
  }

  async verifyServerNotVisible(title: string): Promise<void> {
    const rows = this.page
      .locator(S.table.rows)
      .filter({ hasText: title });

    await expect(rows).toHaveCount(0);
  }

  async searchServer(title: string): Promise<void> {
    // Search selector can be added centrally if the listing has a search field.
    const search = this.page.locator(
      'input[placeholder*="search" i]'
    ).first();

    if (await search.count()) {
      await search.fill(title);
    }
  }

  async verifyServerDetails(
    data: StreamingServerFormData
  ): Promise<void> {
    const row = await this.getRow(data.title);

    await expect(row.locator(S.row.title)).toContainText(data.title);
    await expect(row.locator(S.row.host)).toContainText(data.host);

    for (const group of data.accountGroups) {
      await expect(row.locator(S.row.groups)).toContainText(group);
    }

    // Health is runtime-dependent (Online/Degraded/Offline).
    // Verify that a health value is displayed, not that it is always Online.
    await expect(row.locator(S.row.health)).not.toBeEmpty();

    // Verify the enabled state when the row exposes a checkbox or switch.
    const enabledCell = row.locator(S.row.enabled);
    const checkbox = enabledCell.locator('input[type="checkbox"]').first();
    const switchControl = enabledCell.locator('[role="switch"]').first();

    if (await checkbox.count()) {
      await expect(checkbox).toBeChecked({
        checked: data.enabled,
      });
    } else if (await switchControl.count()) {
      await expect(switchControl).toHaveAttribute(
        'aria-checked',
        String(data.enabled)
      );
    } else {
      await expect(enabledCell).toContainText(
        data.enabled ? /Enabled|Yes|Active/i : /Disabled|No|Inactive/i
      );
    }
  }

  // ---------------- Update ----------------

  async clickEditServer(title: string): Promise<void> {
    const row = await this.getRow(title);
    const editButton = row.locator(S.rowActions.edit).first();

    await expect(editButton).toBeVisible();
    await editButton.click();

    await this.getModal();
  }

  async updateStreamingServer(
    existingTitle: string,
    updatedData: StreamingServerFormData
  ): Promise<void> {
    await this.clickEditServer(existingTitle);
    await this.fillStreamingServerForm(updatedData);
    await this.saveServer();

    await this.verifyServerVisible(updatedData.title);
  }

  // ---------------- Delete ----------------

  async deleteStreamingServer(title: string): Promise<void> {
    const row = await this.getRow(title);
    const deleteButton = row.locator(S.rowActions.delete).first();

    await expect(deleteButton).toBeVisible();

    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 1500 })
      .catch(() => null);

    await deleteButton.click();

    const nativeDialog = await dialogPromise;

    if (nativeDialog) {
      await nativeDialog.accept();
    } else {
      const confirmation = this.page
        .locator(S.confirmation.dialog)
        .filter({
          has: this.page.locator(S.confirmation.confirm),
        })
        .last();

      if (
        await confirmation.count() &&
        await confirmation.isVisible()
      ) {
        await confirmation
          .locator(S.confirmation.confirm)
          .first()
          .click();
      }
    }

    await this.verifyServerNotVisible(title);
  }

  // ---------------- Overview ----------------

  async verifyOverviewMetrics(): Promise<void> {
    await expect(
      this.page.locator(S.metrics.onlineServers).first()
    ).toBeVisible();

    await expect(
      this.page.locator(S.metrics.clientsWatching).first()
    ).toBeVisible();

    await expect(
      this.page.locator(S.metrics.liveStreamsPublishing).first()
    ).toBeVisible();

    await expect(
      this.page.locator(S.metrics.needAttention).first()
    ).toBeVisible();
  }
}
