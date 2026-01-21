import { test, expect } from '@fixtures/pomFixture';

test.describe('Logout Functionality', () => {

    test('should logout successfully via header menu', async ({ loginPage, inventoryPage, page }) => {
        // 1. Ensure we are logged in (handled by fixture, but explicit navigation helps)
        await loginPage.navigate('/inventory.html');

        // 2. Perform Logout using the Header component
        // The BasePage (which InventoryPage extends) has the 'header' property.
        await inventoryPage.header.logout();

        // 3. Verify we are redirected to the Login Page
        await expect(page).toHaveURL('/');

        // 4. Verify login elements are visible again
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

});
