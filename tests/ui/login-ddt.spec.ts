import { test, expect } from '../../fixtures/pomFixture';
import users from '../test-data/login-users.json';

// We must ignore the global auth state for login tests
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Data-Driven Login Tests', () => {
    // Iterate over each user object in the JSON file
    for (const user of users) {

        // Create a unique test name for each data entry
        test(`should handle login for user: ${user.username}`, async ({ loginPage, inventoryPage }) => {
            await loginPage.navigate('/');
            await loginPage.login(user.username, user.password);

            if (user.isValid) {
                // If valid, expect successful redirect
                await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
            } else {
                // If invalid, expect error message
                await expect(loginPage.errorMessage).toBeVisible();
                if (user.expectedError) {
                    await expect(loginPage.errorMessage).toContainText(user.expectedError);
                }
            }
        });
    }
});
