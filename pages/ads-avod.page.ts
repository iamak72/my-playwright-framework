
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  AdsSelectors as S,
  AdvertisementType,
  TargetPlatform,
  DisplayFrequency,
  CampaignType,
  CampaignDuration,
  CampaignStatus,
} from '../locators/ads.selectors';

export interface CampaignFormData {
  name: string;
  type: CampaignType;
  duration: CampaignDuration;
  budget: number;
  status: CampaignStatus;
}

export interface AdvertisementFormData {
  type: AdvertisementType;
  heading: string;
  campaign: string;
  description: string;
  platforms: TargetPlatform[];
  frequency: DisplayFrequency;
  targetAudience?: string;
  priority: number;
}

export class AdsAvodPage extends BasePage {
  private readonly modulePath =
    process.env.PW_ADS_AVOD_PATH || '/Addons/AdsAVOD';

  constructor(page: Page) {
    super(page);
  }

  // =========================================================
  // Common helpers
  // =========================================================

  private async firstVisible(
    selectors: readonly string[],
    parent: Locator | Page = this.page,
  ): Promise<Locator> {
    for (const selector of selectors) {
      const locator = parent.locator(selector).first();

      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }

    throw new Error(
      `No visible element found for selectors: ${selectors.join(', ')}`,
    );
  }

  private async getVisibleModal(
    selectors: readonly string[],
    label: string,
  ): Promise<Locator> {
    for (const selector of selectors) {
      const modal = this.page.locator(selector).last();

      if (await modal.isVisible().catch(() => false)) {
        return modal;
      }
    }

    throw new Error(`${label} modal is not visible.`);
  }

  private async selectDropdownValue(
    control: Locator,
    value: string,
  ): Promise<void> {
    const tagName = await control.evaluate(element =>
      element.tagName.toLowerCase(),
    );

    if (tagName === 'select') {
      const selectedByLabel = await control
        .selectOption({ label: value })
        .then(() => true)
        .catch(() => false);

      if (selectedByLabel) return;

      await control.selectOption({ value });
      return;
    }

    await control.click();

    const option = this.page
      .getByRole('option', { name: value, exact: true })
      .last();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }

    const textOption = this.page
      .getByText(value, { exact: true })
      .last();

    await expect(textOption).toBeVisible();
    await textOption.click();
  }

  private async setCheckbox(
    selectors: readonly string[],
    checked: boolean,
    parent: Locator,
    label: string,
  ): Promise<void> {
    const control = await this.firstVisible(selectors, parent);

    const tagName = await control.evaluate(element =>
      element.tagName.toLowerCase(),
    );

    if (tagName === 'input') {
      const inputType = await control.getAttribute('type');

      if (inputType === 'checkbox') {
        if (checked) {
          await control.check({ force: true });
        } else {
          await control.uncheck({ force: true });
        }

        await expect(control).toBeChecked({ checked });
        return;
      }
    }

    const role = await control.getAttribute('role');

    if (role === 'switch' || role === 'checkbox') {
      const currentState =
        (await control.getAttribute('aria-checked')) === 'true';

      if (currentState !== checked) {
        await control.click();
      }

      await expect(control).toHaveAttribute(
        'aria-checked',
        String(checked),
      );
      return;
    }

    // If the selector points to a styled label/container,
    // use its associated checkbox when available.
    const nestedCheckbox = control.locator('input[type="checkbox"]');

    if (await nestedCheckbox.count()) {
      if (checked) {
        await nestedCheckbox.check({ force: true });
      } else {
        await nestedCheckbox.uncheck({ force: true });
      }
      return;
    }

    throw new Error(
      `Unable to set checkbox "${label}". Verify its selector and markup.`,
    );
  }

  private async selectRadio(
    selectors: readonly string[],
    parent: Locator,
    label: string,
  ): Promise<void> {
    const control = await this.firstVisible(selectors, parent);

    const tagName = await control.evaluate(element =>
      element.tagName.toLowerCase(),
    );

    if (tagName === 'input') {
      await control.check({ force: true });
      await expect(control).toBeChecked();
      return;
    }

    const role = await control.getAttribute('role');

    if (role === 'radio') {
      await control.click();
      await expect(control).toHaveAttribute('aria-checked', 'true');
      return;
    }

    throw new Error(
      `Unable to select frequency "${label}". Verify its selector.`,
    );
  }

  private async fillTextField(
    selectors: readonly string[],
    parent: Locator,
    value: string,
  ): Promise<void> {
    const input = await this.firstVisible(selectors, parent);
    await input.fill(value);
  }

  private async fillNumberField(
    selectors: readonly string[],
    parent: Locator,
    value: number,
    fieldName: string,
  ): Promise<void> {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`${fieldName} must be a non-negative number.`);
    }

    const input = await this.firstVisible(selectors, parent);
    await input.fill(String(value));
  }

  private async getTable(
    selectors: readonly string[],
  ): Promise<Locator> {
    return this.firstVisible(selectors);
  }

  private async getRow(
    tableSelectors: readonly string[],
    rowSelector: string,
    recordName: string,
  ): Promise<Locator> {
    const table = await this.getTable(tableSelectors);
    const row = table
      .locator(rowSelector)
      .filter({ hasText: recordName })
      .first();

    await expect(
      row,
      `Record "${recordName}" should appear in the listing.`,
    ).toBeVisible();

    return row;
  }

  private async searchListing(
    selectors: readonly string[],
    value: string,
  ): Promise<void> {
    const search = await this.firstVisible(selectors);
    await search.fill(value);
  }

  private async clearListingSearch(
    selectors: readonly string[],
  ): Promise<void> {
    const search = await this.firstVisible(selectors);
    await search.clear();
  }

  private async confirmDelete(
    recordName: string,
    clickDelete: () => Promise<void>,
  ): Promise<void> {
    // Listen before clicking to avoid missing native dialogs.
    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 1500 })
      .catch(() => null);

    await clickDelete();

    const nativeDialog = await dialogPromise;

    if (nativeDialog) {
      await nativeDialog.accept();
      return;
    }

    const confirmation = await this.firstVisible(
      S.confirmation.dialog,
    );

    const confirmButton = await this.firstVisible(
      S.confirmation.confirm,
      confirmation,
    );

    await confirmButton.click();

    await expect(confirmation).toBeHidden({
      timeout: 10000,
    });

    // recordName is retained in the method signature for useful
    // failure context when a delete flow is debugged.
    expect(recordName).toBeTruthy();
  }

  // =========================================================
  // Navigation
  // =========================================================

  async gotoAdsAvod(): Promise<void> {
    await this.navigateToModule(this.modulePath);

    await expect(
      this.page.getByText(S.page.heading, { exact: true }).first(),
    ).toBeVisible();
  }

  async openAdvertisements(): Promise<void> {
    const tab = await this.firstVisible(
      S.navigation.advertisements,
    );

    await tab.click();
    await this.firstVisible(S.advertisements.search);
    await this.firstVisible(S.advertisements.table);
  }

  async openCampaigns(): Promise<void> {
    const tab = await this.firstVisible(
      S.navigation.campaigns,
    );

    await tab.click();
    await this.firstVisible(S.campaigns.search);
    await this.firstVisible(S.campaigns.table);
  }

  // =========================================================
  // Campaigns - Listing / Search
  // =========================================================

  async clickNewCampaign(): Promise<void> {
    const button = await this.firstVisible(
      S.campaigns.addButton,
    );

    await button.click();
    await this.getVisibleModal(
      S.campaigns.modal.root,
      'Campaign',
    );
  }

  async searchCampaign(name: string): Promise<void> {
    await this.searchListing(S.campaigns.search, name);
  }

  async clearCampaignSearch(): Promise<void> {
    await this.clearListingSearch(S.campaigns.search);
  }

  async getCampaignRow(name: string): Promise<Locator> {
    return this.getRow(
      S.campaigns.table,
      S.campaigns.rows,
      name,
    );
  }

  async verifyCampaignVisible(name: string): Promise<void> {
    await this.getCampaignRow(name);
  }

  async verifyCampaignNotVisible(name: string): Promise<void> {
    const table = await this.getTable(S.campaigns.table);

    await expect(
      table.locator(S.campaigns.rows).filter({ hasText: name }),
    ).toHaveCount(0);
  }

  // =========================================================
  // Campaigns - Form
  // =========================================================

  private async getCampaignModal(): Promise<Locator> {
    return this.getVisibleModal(
      S.campaigns.modal.root,
      'Campaign',
    );
  }

  async fillCampaignName(name: string): Promise<void> {
    if (!name.trim()) {
      throw new Error('Campaign name is required.');
    }

    const modal = await this.getCampaignModal();

    await this.fillTextField(
      S.campaigns.modal.name,
      modal,
      name,
    );
  }

  async selectCampaignType(type: CampaignType): Promise<void> {
    const modal = await this.getCampaignModal();
    const control = await this.firstVisible(
      S.campaigns.modal.type,
      modal,
    );

    await this.selectDropdownValue(control, type);
  }

  async selectCampaignDuration(
    duration: CampaignDuration,
  ): Promise<void> {
    const modal = await this.getCampaignModal();
    const control = await this.firstVisible(
      S.campaigns.modal.duration,
      modal,
    );

    await this.selectDropdownValue(control, duration);
  }

  async fillCampaignBudget(budget: number): Promise<void> {
    const modal = await this.getCampaignModal();

    await this.fillNumberField(
      S.campaigns.modal.budget,
      modal,
      budget,
      'Campaign budget',
    );
  }

  async selectCampaignStatus(
    status: CampaignStatus,
  ): Promise<void> {
    const modal = await this.getCampaignModal();
    const control = await this.firstVisible(
      S.campaigns.modal.status,
      modal,
    );

    await this.selectDropdownValue(control, status);
  }

  async fillCampaignForm(data: CampaignFormData): Promise<void> {
    await this.fillCampaignName(data.name);
    await this.selectCampaignType(data.type);
    await this.selectCampaignDuration(data.duration);
    await this.fillCampaignBudget(data.budget);
    await this.selectCampaignStatus(data.status);
  }

  async saveCampaign(): Promise<void> {
    const modal = await this.getCampaignModal();
    const button = await this.firstVisible(
      S.campaigns.modal.save,
      modal,
    );

    await expect(button).toBeEnabled();
    await button.click();

    await expect(modal).toBeHidden({
      timeout: 15000,
    });
  }

  async cancelCampaign(): Promise<void> {
    const modal = await this.getCampaignModal();
    const button = await this.firstVisible(
      S.campaigns.modal.cancel,
      modal,
    );

    await button.click();
    await expect(modal).toBeHidden();
  }

  async createCampaign(data: CampaignFormData): Promise<void> {
    await this.clickNewCampaign();
    await this.fillCampaignForm(data);
    await this.saveCampaign();
  }

  // =========================================================
  // Campaigns - Edit / Update
  // =========================================================

  async clickEditCampaign(name: string): Promise<void> {
    const row = await this.getCampaignRow(name);
    const button = await this.firstVisible(
      S.campaigns.rowActions.edit,
      row,
    );

    await button.click();
    await this.getCampaignModal();
  }

  async updateCampaign(
    currentName: string,
    updatedData: CampaignFormData,
  ): Promise<void> {
    await this.clickEditCampaign(currentName);
    await this.fillCampaignForm(updatedData);
    await this.saveCampaign();
  }

  // =========================================================
  // Campaigns - Delete
  // =========================================================

  async deleteCampaign(name: string): Promise<void> {
    await this.confirmDelete(name, async () => {
      const row = await this.getCampaignRow(name);
      const button = await this.firstVisible(
        S.campaigns.rowActions.delete,
        row,
      );

      await button.click();
    });
  }

  // =========================================================
  // Advertisements - Listing / Search
  // =========================================================

  async clickNewAdvertisement(): Promise<void> {
    const button = await this.firstVisible(
      S.advertisements.addButton,
    );

    await button.click();
    await this.getVisibleModal(
      S.advertisements.modal.root,
      'Advertisement',
    );
  }

  async searchAdvertisement(value: string): Promise<void> {
    await this.searchListing(
      S.advertisements.search,
      value,
    );
  }

  async clearAdvertisementSearch(): Promise<void> {
    await this.clearListingSearch(
      S.advertisements.search,
    );
  }

  async getAdvertisementRow(heading: string): Promise<Locator> {
    return this.getRow(
      S.advertisements.table,
      S.advertisements.rows,
      heading,
    );
  }

  async verifyAdvertisementVisible(heading: string): Promise<void> {
    await this.getAdvertisementRow(heading);
  }

  async verifyAdvertisementNotVisible(
    heading: string,
  ): Promise<void> {
    const table = await this.getTable(
      S.advertisements.table,
    );

    await expect(
      table.locator(S.advertisements.rows)
        .filter({ hasText: heading }),
    ).toHaveCount(0);
  }

  // =========================================================
  // Advertisements - Form
  // =========================================================

  private async getAdvertisementModal(): Promise<Locator> {
    return this.getVisibleModal(
      S.advertisements.modal.root,
      'Advertisement',
    );
  }

  async selectAdvertisementType(
    type: AdvertisementType,
  ): Promise<void> {
    const modal = await this.getAdvertisementModal();
    const control = await this.firstVisible(
      S.advertisements.modal.type,
      modal,
    );

    await this.selectDropdownValue(control, type);
  }

  async fillAdvertisementHeading(heading: string): Promise<void> {
    if (!heading.trim()) {
      throw new Error('Advertisement heading is required.');
    }

    const modal = await this.getAdvertisementModal();

    await this.fillTextField(
      S.advertisements.modal.heading,
      modal,
      heading,
    );
  }

  async selectAdvertisementCampaign(
    campaignName: string,
  ): Promise<void> {
    const modal = await this.getAdvertisementModal();
    const control = await this.firstVisible(
      S.advertisements.modal.campaign,
      modal,
    );

    await this.selectDropdownValue(control, campaignName);
  }

  async fillAdvertisementDescription(
    description: string,
  ): Promise<void> {
    if (!description.trim()) {
      throw new Error('Advertisement description is required.');
    }

    const modal = await this.getAdvertisementModal();

    await this.fillTextField(
      S.advertisements.modal.description,
      modal,
      description,
    );
  }

  async selectTargetPlatforms(
    platforms: TargetPlatform[],
  ): Promise<void> {
    if (!platforms.length) {
      throw new Error('Select at least one target platform.');
    }

    const modal = await this.getAdvertisementModal();

    const platformMap = {
      Mobile: S.advertisements.modal.platforms.mobile,
      TV: S.advertisements.modal.platforms.tv,
      'TV Launcher': S.advertisements.modal.platforms.tvLauncher,
      Web: S.advertisements.modal.platforms.web,
      All: S.advertisements.modal.platforms.all,
    };

    // "All" is exclusive in this test model.
    const selectedPlatforms: TargetPlatform[] =
      platforms.includes('All') ? ['All'] : platforms;

    for (const [platform, selectors] of Object.entries(platformMap)) {
      await this.setCheckbox(
        selectors,
        selectedPlatforms.includes(platform as TargetPlatform),
        modal,
        platform,
      );
    }
  }

  async selectDisplayFrequency(
    frequency: DisplayFrequency,
  ): Promise<void> {
    const modal = await this.getAdvertisementModal();

    const frequencyMap = {
      Hourly: S.advertisements.modal.frequency.hourly,
      Daily: S.advertisements.modal.frequency.daily,
      Weekly: S.advertisements.modal.frequency.weekly,
    };

    await this.selectRadio(
      frequencyMap[frequency],
      modal,
      frequency,
    );
  }

  async fillTargetAudience(audience?: string): Promise<void> {
    if (audience === undefined) return;

    const modal = await this.getAdvertisementModal();

    await this.fillTextField(
      S.advertisements.modal.targetAudience,
      modal,
      audience,
    );
  }

  async fillDisplayPriority(priority: number): Promise<void> {
    const modal = await this.getAdvertisementModal();

    await this.fillNumberField(
      S.advertisements.modal.priority,
      modal,
      priority,
      'Display priority',
    );
  }

  async fillAdvertisementForm(
    data: AdvertisementFormData,
  ): Promise<void> {
    await this.selectAdvertisementType(data.type);
    await this.fillAdvertisementHeading(data.heading);
    await this.selectAdvertisementCampaign(data.campaign);
    await this.fillAdvertisementDescription(data.description);
    await this.selectTargetPlatforms(data.platforms);
    await this.selectDisplayFrequency(data.frequency);
    await this.fillTargetAudience(data.targetAudience);
    await this.fillDisplayPriority(data.priority);
  }

  async saveAdvertisement(): Promise<void> {
    const modal = await this.getAdvertisementModal();
    const button = await this.firstVisible(
      S.advertisements.modal.save,
      modal,
    );

    await expect(button).toBeEnabled();
    await button.click();

    await expect(modal).toBeHidden({
      timeout: 15000,
    });
  }

  async cancelAdvertisement(): Promise<void> {
    const modal = await this.getAdvertisementModal();
    const button = await this.firstVisible(
      S.advertisements.modal.cancel,
      modal,
    );

    await button.click();
    await expect(modal).toBeHidden();
  }

  async createAdvertisement(
    data: AdvertisementFormData,
  ): Promise<void> {
    await this.clickNewAdvertisement();
    await this.fillAdvertisementForm(data);
    await this.saveAdvertisement();
  }

  // =========================================================
  // Advertisements - Edit / Update
  // =========================================================

  async clickEditAdvertisement(heading: string): Promise<void> {
    const row = await this.getAdvertisementRow(heading);
    const button = await this.firstVisible(
      S.advertisements.rowActions.edit,
      row,
    );

    await button.click();
    await this.getAdvertisementModal();
  }

  async updateAdvertisement(
    currentHeading: string,
    updatedData: AdvertisementFormData,
  ): Promise<void> {
    await this.clickEditAdvertisement(currentHeading);
    await this.fillAdvertisementForm(updatedData);
    await this.saveAdvertisement();
  }

  // =========================================================
  // Advertisements - Delete
  // =========================================================

  async deleteAdvertisement(heading: string): Promise<void> {
    await this.confirmDelete(heading, async () => {
      const row = await this.getAdvertisementRow(heading);
      const button = await this.firstVisible(
        S.advertisements.rowActions.delete,
        row,
      );

      await button.click();
    });
  }
}
