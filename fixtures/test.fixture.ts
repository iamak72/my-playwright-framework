
import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { EpgPage } from '../pages/epg.page';
import { VodPage } from '../pages/vod.page';
import { SectionsPage } from '../pages/sections.page';
import { UsersPage } from '../pages/users.page';
import { RolesPage } from '../pages/roles.page';
import { PermissionsPage } from '../pages/permissions.page';
import { AccountsPage } from '../pages/accounts.page';

type FrameworkFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  forgotPasswordPage: ForgotPasswordPage;
  epgPage: EpgPage;
  vodPage: VodPage;
  sectionsPage: SectionsPage;
  usersPage: UsersPage;
  rolesPage: RolesPage;
  permissionsPage: PermissionsPage;
  accountsPage: AccountsPage;
};

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  epgPage: async ({ page }, use) => {
    await use(new EpgPage(page));
  },

  vodPage: async ({ page }, use) => {
    await use(new VodPage(page));
  },

  sectionsPage: async ({ page }, use) => {
    await use(new SectionsPage(page));
  },

  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },

  rolesPage: async ({ page }, use) => {
    await use(new RolesPage(page));
  },

  permissionsPage: async ({ page }, use) => {
    await use(new PermissionsPage(page));
  },

  accountsPage: async ({ page }, use) => {
    await use(new AccountsPage(page));
  },
});

export { expect };
