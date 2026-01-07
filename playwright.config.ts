import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Read from default ".env" file.
// This loads environment variables (like passwords or API keys) from a .env file into the Node.js process.env object.
// This keeps sensitive data out of the source code.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Define the path to the auth state file.
const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

// Export the configuration object that Playwright will use to run the tests.
export default defineConfig({
  // Specifies the directory where your test files (.spec.ts) are located.
  testDir: './tests',

  /* Run tests in files in parallel */
  // If true, tests inside a single file will run in parallel. By default, only tests from different files run in parallel.
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // 'process.env.CI' is usually set to 'true' in CI environments (like GitHub Actions).
  // This prevents committing debug code (test.only) that would skip all other tests.
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  // If running in CI, retry failed tests 2 times to handle flaky tests. Locally, do not retry (0).
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  // In CI, we often want to limit resource usage, so we set workers to 1 (sequential).
  // Locally, 'undefined' lets Playwright use as many workers as logical CPU cores.
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // Generates an HTML report that you can view in the browser to debug failed tests.
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // This allows you to use relative paths in tests, e.g., page.goto('/') instead of the full URL.
    baseURL: 'https://www.saucedemo.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // 'on-first-retry' records a trace (screenshots, network calls, etc.) only when a test fails and executes a retry.
    // This saves disk space while still providing debug info for failures.
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project to authenticate before other tests run.
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /auth\.setup\.ts/,
    },

    // API Project
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },

    // UI Projects
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Safari'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});
