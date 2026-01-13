import { test, expect } from '@fixtures/pomFixture';
import users from '../test-data/login-users.json';

// We must ignore the global auth state for login tests
test.use({ storageState: { cookies: [], origins: [] } });

/* eslint-disable playwright/no-conditional-in-test, playwright/no-conditional-expect */
test.describe('Data-Driven Login Tests', () => {
  // Filter users for valid and invalid scenarios
  const validUsers = users.filter((u) => u.isValid);
  const invalidUsers = users.filter((u) => !u.isValid);

  // Disable worker auth for all tests in this file
  test.use({ useWorkerAuth: false });

  test.beforeEach(async ({ page, loginPage }) => {
    // Navigate first to establish domain context
    await loginPage.navigate('/');

    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Reload to apply clean state
    await loginPage.navigate('/');
  });

  for (const user of validUsers) {
    test(`should login successfully for user: ${user.username}`, async ({
      loginPage,
      inventoryPage,
    }) => {
      await loginPage.navigate('/');
      await loginPage.login(user.username, user.password);
      await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    });
  }

  for (const user of invalidUsers) {
    test(`should show error for user: ${user.username}`, async ({ loginPage }) => {
      await loginPage.navigate('/');
      await loginPage.login(user.username, user.password);
      await expect(loginPage.errorMessage).toBeVisible();
      if (user.expectedError) {
        await expect(loginPage.errorMessage).toContainText(user.expectedError);
      }
    });
  }
});
