
import { test, expect } from '../../../fixtures/test.fixture';

import { BasePage } from '../../../pages/base.page';
import { TariffsPage } from '../../../pages/tariffs.page';
import { TariffSelectors } from '../../../locators/tariff.selectors';

test.describe('Administration - Tariffs - Navigation', () => {

    test('should navigate to Tariffs listing page using BasePage', async ({
        page,
    }) => {
        const basePage = new BasePage(page);

        await basePage.navigateToModule(
            TariffSelectors.route,
        );

        await expect(page).toHaveURL(
            new RegExp(
                `${TariffSelectors.route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[/?#]|$)`,
            ),
        );

        await expect(
            page.locator(
                TariffSelectors.listing.addPackage.join(', '),
            ).first(),
        ).toBeVisible();
    });

    test('should navigate to Tariffs using TariffsPage', async ({
        page,
    }) => {
        const tariffsPage = new TariffsPage(page);

        await tariffsPage.gotoTariffs();

        await expect(
            page.locator(
                TariffSelectors.listing.addPackage.join(', '),
            ).first(),
        ).toBeVisible();
    });

    test('should open Add Package form', async ({ page }) => {
        const tariffsPage = new TariffsPage(page);

        await tariffsPage.gotoTariffs();
        await tariffsPage.openAddPackageForm();

        await expect(
            tariffsPage.getPackageModal(),
        ).toBeVisible();
    });
});
