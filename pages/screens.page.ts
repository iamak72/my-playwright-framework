
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ScreenSelectors as S } from '../locators/screen.selectors';

export type ScreenMode = 'Dark' | 'Light';
export type BackgroundType = 'Colour' | 'Image';

export type ScreenDeviceType =
  | 'TV Box'
  | 'TV App'
  | 'Mobile';

export interface ScreenFormData {
  internalName: string;
  englishName?: string;
  spanishName?: string;
  active?: boolean;
  isDefault?: boolean;
  mode: ScreenMode;
  accentColor: string;
  backgroundType?: BackgroundType;
  backgroundColor?: string;
  deviceTypes: ScreenDeviceType[];
  accountGroups: string[];
  deviceFilter?: string;
}

export class ScreensPage extends BasePage {
  private readonly modulePath =
    process.env.PW_SCREENS_PATH || '/Addons/Screens';

  constructor(page: Page) {
    super(page);
  }

  // ---------------------------------------------------------
  // Common locator helpers
  // ---------------------------------------------------------

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
      `No visible element found: ${selectors.join(', ')}`,
    );
  }

  private async getForm(): Promise<Locator> {
    return this.firstVisible(S.form.root);
  }

  private async clickSection(
    selectors: readonly string[],
  ): Promise<void> {
    for (const selector of selectors) {
      const section = this.page.locator(selector).first();

      if (await section.isVisible().catch(() => false)) {
        await section.click();
        return;
      }
    }
  }

  private async fillField(
    selectors: readonly string[],
    value: string,
    parent: Locator,
  ): Promise<void> {
    const field = await this.firstVisible(selectors, parent);
    await field.fill(value);
  }

  private async setCheckbox(
    selectors: readonly string[],
    checked: boolean,
    parent: Locator,
    label: string,
  ): Promise<void> {
    const control = await this.firstVisible(selectors, parent);

    const tagName = await control.evaluate(
      element => element.tagName.toLowerCase(),
    );

    if (tagName === 'input') {
      const type = await control.getAttribute('type');

      if (type === 'checkbox') {
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

    if (role === 'checkbox' || role === 'switch') {
      const current =
        (await control.getAttribute('aria-checked')) === 'true';

      if (current !== checked) {
        await control.click();
      }

      await expect(control).toHaveAttribute(
        'aria-checked',
        String(checked),
      );
      return;
    }

    const nested = control.locator('input[type="checkbox"]');

    if (await nested.count()) {
      if (checked) {
        await nested.check({ force: true });
      } else {
        await nested.uncheck({ force: true });
      }
      return;
    }

    throw new Error(
      `Unable to set checkbox "${label}". Check its selector.`,
    );
  }

  private async selectOption(
    control: Locator,
    value: string,
  ): Promise<void> {
    const tagName = await control.evaluate(
      element => element.tagName.toLowerCase(),
    );

    if (tagName === 'select') {
      const selected = await control
        .selectOption({ label: value })
        .then(() => true)
        .catch(() => false);

      if (!selected) {
        await control.selectOption({ value });
      }

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

  private async selectRadio(
    selectors: readonly string[],
    parent: Locator,
  ): Promise<void> {
    const control = await this.firstVisible(selectors, parent);

    const tagName = await control.evaluate(
      element => element.tagName.toLowerCase(),
    );

    if (tagName === 'input') {
      await control.check({ force: true });
      await expect(control).toBeChecked();
      return;
    }

    await control.click();
  }

  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------

  async gotoScreens(): Promise<void> {
    await this.navigateToModule(this.modulePath);

    await expect(
      this.page.getByText('Screens', { exact: true }).first(),
    ).toBeVisible();
  }

  async verifyScreensPage(): Promise<void> {
    await expect(
      this.page.getByText('Screens', { exact: true }).first(),
    ).toBeVisible();

    await this.firstVisible(S.listing.table);
  }

  // ---------------------------------------------------------
  // Listing and search
  // ---------------------------------------------------------

  async clickAddScreen(): Promise<void> {
    const button = await this.firstVisible(S.page.addButton);
    await button.click();
    await this.getForm();
  }

  async searchScreen(name: string): Promise<void> {
    const search = await this.firstVisible(S.page.search);
    await search.fill(name);
  }

  async clearSearch(): Promise<void> {
    const search = await this.firstVisible(S.page.search);
    await search.clear();
  }

  async getScreenRow(name: string): Promise<Locator> {
    const table = await this.firstVisible(S.listing.table);

    const row = table
      .locator(S.listing.rows)
      .filter({ hasText: name })
      .first();

    await expect(
      row,
      `Screen "${name}" should appear in listing.`,
    ).toBeVisible();

    return row;
  }

  async verifyScreenVisible(name: string): Promise<void> {
    await this.getScreenRow(name);
  }

  async verifyScreenNotVisible(name: string): Promise<void> {
    const table = await this.firstVisible(S.listing.table);

    await expect(
      table.locator(S.listing.rows).filter({ hasText: name }),
    ).toHaveCount(0);
  }

  async verifyScreenStatus(
    name: string,
    status: string,
  ): Promise<void> {
    const row = await this.getScreenRow(name);

    await expect(row).toContainText(status);
  }

  async verifyScreenAudience(
    name: string,
    audience: string,
  ): Promise<void> {
    const row = await this.getScreenRow(name);

    await expect(row).toContainText(audience);
  }

  async verifyScreenCountVisible(): Promise<void> {
    await this.firstVisible(S.page.count);
  }

  // ---------------------------------------------------------
  // Details section
  // ---------------------------------------------------------

  async fillInternalName(name: string): Promise<void> {
    if (!name.trim()) {
      throw new Error('Internal screen name is required.');
    }

    const form = await this.getForm();

    await this.fillField(
      S.form.details.internalName,
      name,
      form,
    );
  }

  async fillEnglishName(name?: string): Promise<void> {
    if (name === undefined) return;

    const form = await this.getForm();

    await this.fillField(
      S.form.details.englishName,
      name,
      form,
    );
  }

  async fillSpanishName(name?: string): Promise<void> {
    if (name === undefined) return;

    const form = await this.getForm();

    await this.fillField(
      S.form.details.spanishName,
      name,
      form,
    );
  }

  async setActive(active: boolean): Promise<void> {
    const form = await this.getForm();

    await this.setCheckbox(
      S.form.details.active,
      active,
      form,
      'Active',
    );
  }

  async setDefault(isDefault: boolean): Promise<void> {
    const form = await this.getForm();

    await this.setCheckbox(
      S.form.details.default,
      isDefault,
      form,
      'Default screen',
    );
  }

  // ---------------------------------------------------------
  // Look section
  // ---------------------------------------------------------

  async selectMode(mode: ScreenMode): Promise<void> {
    const form = await this.getForm();

    const selectors =
      mode === 'Dark'
        ? S.form.look.darkMode
        : S.form.look.lightMode;

    await this.selectRadio(selectors, form);
  }

  async selectAccentColor(color: string): Promise<void> {
    const form = await this.getForm();

    const swatch = await this.firstVisible(
      S.form.look.accentColor(color),
      form,
    );

    await swatch.click();
  }

  // ---------------------------------------------------------
  // Background section
  // ---------------------------------------------------------

  async selectBackgroundType(
    type: BackgroundType,
  ): Promise<void> {
    const form = await this.getForm();

    const selectors =
      type === 'Colour'
        ? S.form.background.colorType
        : S.form.background.imageType;

    await this.selectRadio(selectors, form);
  }

  async setBackgroundColor(color: string): Promise<void> {
    const form = await this.getForm();

    const picker = await this.firstVisible(
      S.form.background.colorPicker,
      form,
    );

    await picker.fill(color);
  }

  // ---------------------------------------------------------
  // Device types
  // ---------------------------------------------------------

  async selectDeviceTypes(
    deviceTypes: ScreenDeviceType[],
  ): Promise<void> {
    if (!deviceTypes.length) {
      throw new Error('Select at least one device type.');
    }

    const form = await this.getForm();

    const map = {
      'TV Box': S.form.deviceTypes.tvBox,
      'TV App': S.form.deviceTypes.tvApp,
      Mobile: S.form.deviceTypes.mobile,
    };

    for (const [name, selectors] of Object.entries(map)) {
      await this.setCheckbox(
        selectors,
        deviceTypes.includes(name as ScreenDeviceType),
        form,
        name,
      );
    }
  }

  // ---------------------------------------------------------
  // Who sees it - Audience
  // ---------------------------------------------------------

  async selectAccountGroups(
    groups: string[],
  ): Promise<void> {
    if (!groups.length) {
      throw new Error('At least one account group is required.');
    }

    const form = await this.getForm();

    const container = await this.firstVisible(
      S.form.audience.accountGroups,
      form,
    );

    for (const group of groups) {
      const checkbox = container.getByLabel(group, {
        exact: true,
      });

      if (await checkbox.count()) {
        await checkbox.check({ force: true });
      } else {
        const label = container.getByText(group, {
          exact: true,
        });

        await expect(label).toBeVisible();
        await label.click();
      }
    }
  }

  async selectDeviceFilter(value?: string): Promise<void> {
    if (!value) return;

    const form = await this.getForm();

    const dropdown = await this.firstVisible(
      S.form.audience.deviceFilter,
      form,
    );

    await this.selectOption(dropdown, value);
  }

  // ---------------------------------------------------------
  // Complete form
  // ---------------------------------------------------------

  async fillScreenForm(data: ScreenFormData): Promise<void> {
    // Details
    await this.fillInternalName(data.internalName);
    await this.fillEnglishName(data.englishName);
    await this.fillSpanishName(data.spanishName);

    if (data.active !== undefined) {
      await this.setActive(data.active);
    }

    if (data.isDefault !== undefined) {
      await this.setDefault(data.isDefault);
    }

    // Look
    await this.selectMode(data.mode);
    await this.selectAccentColor(data.accentColor);

    // Background
    if (data.backgroundType) {
      await this.selectBackgroundType(data.backgroundType);
    }

    if (
      data.backgroundType === 'Colour' &&
      data.backgroundColor
    ) {
      await this.setBackgroundColor(data.backgroundColor);
    }

    // Device types
    await this.selectDeviceTypes(data.deviceTypes);

    // Target audience
    await this.selectAccountGroups(data.accountGroups);
    await this.selectDeviceFilter(data.deviceFilter);
  }

  // ---------------------------------------------------------
  // Save / Discard
  // ---------------------------------------------------------

  async saveScreen(): Promise<void> {
    const form = await this.getForm();

    const button = await this.firstVisible(
      S.form.footer.save,
      form,
    );

    await expect(button).toBeEnabled();
    await button.click();

    await expect(form).toBeHidden({
      timeout: 15000,
    });
  }

  async discardChanges(): Promise<void> {
    const form = await this.getForm();

    const button = await this.firstVisible(
      S.form.footer.discard,
      form,
    );

    await button.click();

    await expect(form).toBeHidden({
      timeout: 10000,
    });
  }

  async createScreen(data: ScreenFormData): Promise<void> {
    await this.clickAddScreen();
    await this.fillScreenForm(data);
    await this.saveScreen();
    await this.verifyScreenVisible(data.internalName);
  }

  // ---------------------------------------------------------
  // Edit / Update
  // ---------------------------------------------------------

  async clickEditScreen(name: string): Promise<void> {
    const row = await this.getScreenRow(name);

    const button = await this.firstVisible(
      S.listing.edit,
      row,
    );

    await button.click();
    await this.getForm();
  }

  async updateScreen(
    currentName: string,
    updatedData: ScreenFormData,
  ): Promise<void> {
    await this.clickEditScreen(currentName);
    await this.fillScreenForm(updatedData);
    await this.saveScreen();

    await this.verifyScreenVisible(updatedData.internalName);
  }

  // ---------------------------------------------------------
  // Clone / Copy
  // ---------------------------------------------------------

  async cloneScreen(name: string): Promise<void> {
    const row = await this.getScreenRow(name);

    const button = await this.firstVisible(
      S.listing.clone,
      row,
    );

    await button.click();
  }

  // ---------------------------------------------------------
  // Delete
  // ---------------------------------------------------------

  async deleteScreen(name: string): Promise<void> {
    const row = await this.getScreenRow(name);

    const deleteButton = await this.firstVisible(
      S.listing.delete,
      row,
    );

    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 2000 })
      .catch(() => null);

    await deleteButton.click();

    const nativeDialog = await dialogPromise;

    if (nativeDialog) {
      await nativeDialog.accept();
    } else {
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
    }

    await this.verifyScreenNotVisible(name);
  }

  // ---------------------------------------------------------
  // Subscriber testing tool
  // ---------------------------------------------------------

  async verifySubscriberTestingTool(): Promise<void> {
    await this.firstVisible(S.subscriberTool.section);
  }
}
