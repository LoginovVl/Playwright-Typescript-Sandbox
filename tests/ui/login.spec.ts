// Import 'test' and 'expect' from our custom fixture file, not directly from @playwright/test.
// This ensures we have access to our pre-instantiated page objects (loginPage, inventoryPage, etc.).
import { test, expect } from '@fixtures/pomFixture';

// IMPORTANT: Since we have a global setup that logs us in, we need to explicitly tell this test file
// to ignore that global state, because we want to test the login page itself (which requires being logged out).
// Use the new option to disable worker auth for these tests
test.use({ useWorkerAuth: false });

// test.describe groups related tests together.
// It helps in organizing the test report and can apply hooks (like beforeEach) to all tests in the block.
test.describe('Login Functionality', () => {
  // beforeEach is a hook that runs before *every* test in this describe block.
  // We use it here to ensure every test starts from the login page.
  test.beforeEach(async ({ loginPage, page }) => {
    // 1. Navigate to the app first (so we are on the right domain)
    await loginPage.navigate('/');

    // 2. Clear cookies/storage to ensure a clean state (logout)
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // 3. Reload/Navigate again to reflect the logged-out state
    await loginPage.navigate('/');
  });

  // A specific test case: verify successful login.
  // We destructure 'loginPage' and 'inventoryPage' from the fixtures arguments.
  test('should login successfully with valid credentials', async ({ loginPage, inventoryPage }) => {
    // Perform the login action using the Page Object method.
    // We use standard demo credentials.
    await loginPage.login('standard_user', 'secret_sauce');

    // Assertion 1: Check if the URL has changed to the inventory page.
    // We use a regex /.*inventory.html/ to match any URL ending in inventory.html.
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);

    // Assertion 2: Verify the page title text to ensure the correct page content loaded.
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  // A specific test case: verify error handling for invalid/locked users.
  test('should show error with invalid credentials', async ({ loginPage }) => {
    // Attempt to login with a locked-out user account.
    await loginPage.login('locked_out_user', 'secret_sauce');

    // Assertion 1: Check if the error message container is visible on the page.
    await expect(loginPage.errorMessage).toBeVisible();

    // Assertion 2: Verify the exact text of the error message to ensure it's the expected error.
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  // Visual Regression Test
  test('login page visual regression', async ({ page }) => {
    // Visual tests check if the page looks pixels-perfect matches the snapshot.
    // The first time this runs, it will fail and tell you to run with --update-snapshots to create the baseline.
    await expect(page).toHaveScreenshot('login-page.png');
  });
});
