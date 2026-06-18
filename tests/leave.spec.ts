import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LeavePage } from '../pages/LeavePage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe(
  'MPS-003: Leave Management',
  {
    tag: '@MPS-003',
    annotation: {
      type: 'user story',
      description: 'MPS-003',
    },
  },
  () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.loginAndWaitForDashboard(
        VALID_USERNAME,
        VALID_PASSWORD,
      );
    });

    test('employee can navigate to the Leave module', async ({
      page,
    }) => {
      const leavePage = new LeavePage(page);

      await leavePage.openLeaveModule();

      await expect(
        leavePage.leaveListHeader,
      ).toBeVisible();
    });

    test('employee can view their leave balance', async ({ page }) => {
      const leavePage = new LeavePage(page);

      await leavePage.openLeaveModule();
      await leavePage.openApplyPage();

      await expect(leavePage.leaveBalanceText).toBeVisible();
      await expect(leavePage.leaveBalanceText).toContainText(/\d/);
    });

    test('employee can filter My Leave by date range', async ({
      page,
    }) => {
      const leavePage = new LeavePage(page);
      const fromDate = new Date(2026, 0, 1);
      const toDate = new Date(2026, 11, 31);

      await leavePage.openLeaveModule();
      await leavePage.openMyLeavePage();
      await leavePage.filterMyLeave(
        fromDate,
        toDate,
      );

      await expect
        .poll(async () => {
          const hasRows =
            (await leavePage.leaveRows.count()) > 0;
          const hasEmptyState = await page
            .getByText('No Records Found')
            .first()
            .isVisible();

          return hasRows || hasEmptyState;
        })
        .toBe(true);
    });
  },
);
