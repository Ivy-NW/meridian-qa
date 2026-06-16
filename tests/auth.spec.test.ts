import { test, expect } from '@playwright/test';

test.describe('OrangeHRM authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('OrangeHRM login page loads', async ({ page }) => {
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Login' }),
    ).toBeEnabled();
  });

  test('user logs in with valid credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  });

  test('user cannot log in with invalid credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/auth\/login/);
  });
});