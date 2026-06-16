import { expect, Page, test } from '@playwright/test';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

async function openLoginPage(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByPlaceholder('Username')).toBeVisible();
}

async function login(page: Page): Promise<void> {
  await page.getByPlaceholder('Username').fill(VALID_USERNAME);
  await page.getByPlaceholder('Password').fill(VALID_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('.oxd-topbar-header-breadcrumb h6')).toHaveText(
    'Dashboard',
  );
}

test.describe('MPS-001: User Authentication', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await openLoginPage(page);
  });

  test('user can log in with valid credentials', async ({ page }) => {
    await login(page);
  });

  test('user cannot log in with invalid credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.oxd-alert-content-text')).toHaveText(
      /Invalid credentials/,
    );

    await expect(page).toHaveURL(/auth\/login/);
  });

  test('user cannot log in with an empty username', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Username');

    const usernameGroup = page
      .locator('.oxd-input-group')
      .filter({ has: usernameInput });

    await page.getByPlaceholder('Password').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      usernameGroup.getByText('Required', { exact: true }),
    ).toBeVisible();

    await expect(page).toHaveURL(/auth\/login/);
  });

  test('user cannot log in with an empty password', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Password');

    const passwordGroup = page
      .locator('.oxd-input-group')
      .filter({ has: passwordInput });

    await page.getByPlaceholder('Username').fill(VALID_USERNAME);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      passwordGroup.getByText('Required', { exact: true }),
    ).toBeVisible();

    await expect(page).toHaveURL(/auth\/login/);
  });

  test('logged-in user can log out successfully', async ({ page }) => {
    await login(page);

    await page.locator('.oxd-userdropdown-tab').click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Login' }),
    ).toBeVisible();
  });
});
