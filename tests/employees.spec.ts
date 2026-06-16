import { expect, Page, test } from '@playwright/test';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(VALID_USERNAME);
  await page.getByPlaceholder('Password').fill(VALID_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
}

async function openEmployeeList(page: Page): Promise<void> {
  await page.getByRole('link', { name: 'PIM', exact: true }).click();

  await expect(page).toHaveURL(/pim\/viewEmployeeList/);
  await expect(
    page.getByRole('heading', { name: 'Employee Information' }),
  ).toBeVisible();
}

test.describe('MPS-002: Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await openEmployeeList(page);
  });

  test('admin can view the employee list', async ({ page }) => {
    const employeeRows = page.locator(
      '.oxd-table-body .oxd-table-card',
    );

    await expect(employeeRows.first()).toBeVisible();

    const employeeCount = await employeeRows.count();

    expect(employeeCount).toBeGreaterThan(0);
  });

  test('admin can search for an employee by name', async ({ page }) => {
    const employeeRows = page.locator(
      '.oxd-table-body .oxd-table-card',
    );

    await expect(employeeRows.first()).toBeVisible();

    const firstRow = employeeRows.first();
    const cells = firstRow.locator('.oxd-table-cell');

    const employeeFirstName = (
      await cells.nth(2).innerText()
    ).trim();

    expect(employeeFirstName.length).toBeGreaterThan(0);

    const employeeNameInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Name' })
      .getByPlaceholder('Type for hints...');

    await employeeNameInput.fill(employeeFirstName);

    const suggestion = page
      .locator('.oxd-autocomplete-option')
      .filter({ hasText: employeeFirstName })
      .first();

    await expect(suggestion).toBeVisible();
    await suggestion.click();

    await page.getByRole('button', { name: 'Search' }).click();

    await expect(employeeRows.first()).toBeVisible();
    await expect(employeeRows.first()).toContainText(
      employeeFirstName,
    );
  });

  test('admin can navigate to an employee profile', async ({ page }) => {
    const employeeRows = page.locator(
      '.oxd-table-body .oxd-table-card',
    );

    await expect(employeeRows.first()).toBeVisible();

    const firstEmployeeRow = employeeRows.first();

    const editButton = firstEmployeeRow.locator(
      'button:has(i.bi-pencil-fill)',
    );

    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page).toHaveURL(
      /pim\/viewPersonalDetails\/empNumber\//,
    );

    await expect(
      page.getByRole('heading', { name: 'Personal Details' }),
    ).toBeVisible();
  });
});
