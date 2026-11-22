
import { test, expect } from '../../../fixtures/test.fixture';

test.describe('Permissions Matrix - Filters', () => {
    test.beforeEach(async ({ permissionsPage }) => {
        await permissionsPage.gotoPermissions();
    });

    test('should filter roles by Kind', async ({ permissionsPage }) => {
        const kind = process.env.PW_PERMISSION_KIND;

        test.skip(!kind, 'Set PW_PERMISSION_KIND to an available Kind filter option.');

        await permissionsPage.applyKindFilter(kind!);

        await expect(
            permissionsPage.getPage().locator('table, [role="grid"]').first()
        ).toBeVisible();
    });

    test('should filter roles by Status', async ({ permissionsPage }) => {
        const status = process.env.PW_PERMISSION_STATUS;

        test.skip(!status, 'Set PW_PERMISSION_STATUS to an available Status filter option.');

        await permissionsPage.applyStatusFilter(status!);

        await expect(
            permissionsPage.getPage().locator('table, [role="grid"]').first()
        ).toBeVisible();
    });

    test('should filter roles by Members count', async ({
        permissionsPage,
    }) => {
        const members = process.env.PW_PERMISSION_MEMBERS;

        test.skip(
            !members,
            'Set PW_PERMISSION_MEMBERS to an available Members filter option.'
        );

        await permissionsPage.applyMembersFilter(members!);

        await expect(
            permissionsPage.getPage().locator('table, [role="grid"]').first()
        ).toBeVisible();
    });
});
