# Meridian QA Automation Project

## Project Overview

Meridian QA is a Playwright and TypeScript automation project created to validate key workflows in the Meridian People Solutions test scope.

The project includes browser-based UI automation, Page Object Model implementation, reusable test setup, user-story tags, failure evidence, and continuous integration through GitHub Actions.

The current automated coverage focuses on:

* user authentication,
* employee management,
* leave management,
* API automation investigation.

## My Role

I worked as the QA engineer responsible for:

* reviewing the acceptance criteria,
* designing automated test scenarios,
* implementing Playwright tests,
* creating reusable page objects,
* executing and debugging the suite,
* configuring failure evidence,
* organising tests by user story,
* configuring the GitHub Actions pipeline,
* documenting test results and known limitations.

---

## Test Coverage

| User story | Area                | Test type | Current status                           |
| ---------- | ------------------- | --------- | ---------------------------------------- |
| MPS-001    | User Authentication | UI        | Implemented                              |
| MPS-002    | Employee Management | UI        | Implemented                              |
| MPS-003    | Leave Management    | UI        | Implemented                              |
| MPS-004    | API Tests           | API       | Blocked by authentication-response issue |

### MPS-001 — User Authentication

Coverage includes:

* successful login with valid credentials,
* unsuccessful login with invalid credentials,
* validation for an empty username,
* validation for an empty password,
* successful logout.

### MPS-002 — Employee Management

Coverage includes:

* viewing the employee list,
* searching for an employee by name,
* navigating to an employee profile.

### MPS-003 — Leave Management

Coverage includes:

* opening the Leave module,
* viewing leave-balance information,
* submitting a leave request where the required entitlement and test data are available.

### MPS-004 — API Automation

The planned API coverage includes:

* an authenticated request returning employee records,
* an unauthenticated request returning an authorization error,
* a request for a nonexistent employee returning a not-found response.

This user story was not completed because the authentication request did not return the expected token or response required for the subsequent API calls.

The authentication endpoint, request payload, headers, redirects, cookies, and expected response contract require further confirmation before the API tests can be completed reliably.

---

## Project Structure

```text
meridian-qa/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── LeavePage.ts
├── tests/
│   ├── auth.spec.ts
│   ├── employees.spec.ts
│   ├── leave.spec.ts
│   └── api.spec.ts
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Page Object Model

The `pages` directory contains reusable page objects.

* `LoginPage.ts` contains login-page locators and authentication actions.
* `DashboardPage.ts` contains dashboard validation and logout actions.
* `LeavePage.ts` contains Leave-module interactions and loading-state handling.

This structure separates page interactions from test assertions and reduces selector duplication.

### Test files

The `tests` directory contains the specifications grouped by user story.

The tests use Playwright hooks such as `beforeEach` to perform repeated authenticated setup for protected modules.

---

## Tags and Test Organisation

Tests are organised using user-story tags:

* `@MPS-001`
* `@MPS-002`
* `@MPS-003`
* `@MPS-004`

Additional tags may include:

* `@ui`
* `@api`
* `@smoke`
* `@negative`
* `@data-change`

Run a specific user story:

```bash
npx playwright test --grep "@MPS-001"
```

Run UI tests:

```bash
npx playwright test --grep "@ui"
```

Run API tests:

```bash
npx playwright test --grep "@api"
```

---

## Installation

### Prerequisites

Install:

* Node.js,
* npm,
* Git.

Clone the repository:

```bash
git clone <repository-url>
cd meridian-qa
```

Install project dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install --with-deps
```

---

## Running the Tests

Run the complete configured suite:

```bash
npx playwright test
```

Run the Chromium suite:

```bash
npx playwright test --project=chromium
```

Run one test file:

```bash
npx playwright test tests/auth.spec.ts --project=chromium
```

Run tests in headed mode:

```bash
npx playwright test --project=chromium --headed
```

Run tests using Playwright Inspector:

```bash
npx playwright test --debug
```

Open the HTML report:

```bash
npx playwright show-report
```

Run the TypeScript check:

```bash
npx tsc --noEmit
```

## GitHub Actions Pipeline

The GitHub Actions workflow is stored in:

```text
.github/workflows/playwright.yml
```

The workflow runs on:

* pushes to `main`,
* pull requests targeting `main`.

The pipeline:

1. checks out the repository,
2. installs Node.js,
3. installs dependencies using `npm ci`,
4. installs Playwright browsers and Linux dependencies,
5. type-checks the TypeScript project,
6. executes the Playwright suite,
7. uploads the Playwright HTML report,
8. retains failed-test evidence where available.

The pipeline provides independent confirmation that the automation runs in a clean GitHub-hosted environment rather than only on the local machine.

---

## Known Issues and Limitations

### API authentication

MPS-004 remains incomplete because the initial authentication request did not return the expected token or usable authenticated response.

The following need to be confirmed:

* the correct authentication endpoint,
* the required request-body format,
* required headers,
* whether authentication uses a bearer token or session cookies,
* redirect behaviour,
* the expected success response.

### Shared test data

Some UI scenarios depend on data from a shared demonstration environment.

This can affect:

* employee records,
* leave types,
* leave balances,
* leave entitlements.

The tests use condition-based waits, but reliable test-data setup and cleanup would provide stronger isolation.


## Current Delivery Status

Completed:

* MPS-001 UI automation,
* MPS-002 UI automation,
* MPS-003 UI automation,
* Page Object Model implementation,
* reusable authenticated setup,
* test tags and annotations,
* screenshots, videos, and traces for failures,
* GitHub Actions workflow,
* project documentation,
* Loom walkthrough preparation.

Outstanding:

* MPS-004 API authentication,
* completed API assertions,
* full API regression execution.
