import {
  type APIRequestContext,
  type BrowserContext,
  expect,
  test,
} from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';
const EMPLOYEES_ENDPOINT =
  '/web/index.php/api/v2/pim/employees';
const MISSING_EMPLOYEE_CONTACT_ENDPOINT =
  '/web/index.php/api/v2/pim/employees/999/contact-details';
const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

let authenticatedBrowserContext: BrowserContext;
let authenticatedRequest: APIRequestContext;

test.describe(
  'MPS-004: API Tests',
  {
    tag: '@MPS-004',
    annotation: {
      type: 'user story',
      description: 'MPS-004',
    },
  },
  () => {
    test.beforeAll(async ({ browser }) => {
      authenticatedBrowserContext = await browser.newContext({
        baseURL: BASE_URL,
      });

      const page = await authenticatedBrowserContext.newPage();

      await page.goto('/');
      await page.getByPlaceholder('Username').fill(VALID_USERNAME);
      await page.getByPlaceholder('Password').fill(VALID_PASSWORD);
      await page
        .getByRole('button', { name: 'Login', exact: true })
        .click();

      await expect(page).toHaveURL(/dashboard/, {
        timeout: 30_000,
      });

      await expect(
        page.getByRole('heading', {
          name: 'Dashboard',
          exact: true,
        }),
      ).toBeVisible({ timeout: 30_000 });

      authenticatedRequest = authenticatedBrowserContext.request;
    });

    test.afterAll(async () => {
      await authenticatedBrowserContext.close();
    });

    test('valid API request returns employee records', async () => {
      const response = await authenticatedRequest.get(
        EMPLOYEES_ENDPOINT,
        {
          params: {
            limit: 10,
            offset: 0,
          },
          failOnStatusCode: false,
        },
      );

      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
      expect(response.headers()['content-type']).toContain(
        'application/json',
      );

      const body: unknown = await response.json();

      expect(body).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
        }),
      );

      const employeeResponse = body as {
        data: Array<Record<string, unknown>>;
        meta?: {
          total?: number;
        };
      };

      expect(employeeResponse.data.length).toBeGreaterThan(0);

      const firstEmployee = employeeResponse.data[0];

      expect(firstEmployee).toEqual(expect.any(Object));

      const hasEmployeeIdentifier =
        typeof firstEmployee.empNumber === 'number' ||
        typeof firstEmployee.id === 'number';

      expect(hasEmployeeIdentifier).toBe(true);

      if (employeeResponse.meta?.total !== undefined) {
        expect(employeeResponse.meta.total).toBeGreaterThan(0);
      }
    });

    test('unauthenticated API request returns 401', async ({
      playwright,
    }) => {
      const unauthenticatedRequest =
        await playwright.request.newContext({
          baseURL: BASE_URL,
        });

      try {
        const response = await unauthenticatedRequest.get(
          EMPLOYEES_ENDPOINT,
          {
            params: {
              limit: 1,
              offset: 0,
            },
            failOnStatusCode: false,
            maxRedirects: 0,
          },
        );

        expect(response.status()).toBe(401);
        expect(response.ok()).toBeFalsy();
        expect(response.headers()['content-type']).toContain(
          'application/json',
        );

        const body = await response.json();

        expect(body.error.status).toBe(401);
        expect(body.error.message).toBe('Session expired');
      } finally {
        await unauthenticatedRequest.dispose();
      }
    });

    test('request for a non-existent employee returns 404', async () => {
      const response = await authenticatedRequest.get(
        MISSING_EMPLOYEE_CONTACT_ENDPOINT,
        {
          failOnStatusCode: false,
        },
      );

      expect(response.status()).toBe(404);
      expect(response.ok()).toBeFalsy();
      expect(await response.text()).toBe('');
    });
  },
);
