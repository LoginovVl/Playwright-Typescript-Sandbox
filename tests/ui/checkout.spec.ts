// Import 'test' and 'expect' from our custom fixture.
import { test, expect } from '../../fixtures/pomFixture';

// Grouping the checkout flow tests.
test.describe('E2E Checkout Flow', () => {
  // Setup: Setup is much simpler now because we are already logged in (via global setup).
  test.beforeEach(async ({ page }) => {
    // Just navigate to the inventory page to start.
    // Note: We use 'page' here just for simple navigation if needed, or we could use 'inventoryPage'.
    // Since we are already logged in, navigating to '/' should redirect us to inventory, or we can go straight to inventory.
    await page.goto('/inventory.html');
  });

  // End-to-End Test: Simulates a complete user journey from adding an item to finishing checkout.
  // We request 'inventoryPage' and 'checkoutPage' from our fixtures.
  test('should complete checkout successfully', async ({ inventoryPage, checkoutPage }) => {
    // -- Step 1: Add Item to Cart --
    // Use the Inventory Page Object to find and add a specific backpack.
    await inventoryPage.addItemToCart('Sauce Labs Backpack');

    // Navigate to the cart page to begin checkout.
    await inventoryPage.goToCart();

    // -- Step 2: Checkout Process --
    // Click the "Checkout" button on the cart page.
    await checkoutPage.proceedToCheckout();

    // Fill in the required shipping information.
    await checkoutPage.fillInformation('John', 'Doe', '12345');

    // Click "Finish" on the overview page to submit the order.
    await checkoutPage.finishCheckout();

    // -- Step 3: Verification --
    // Verify that the "Thank you" header is visible, confirming the order was placed.
    await expect(checkoutPage.completeHeader).toBeVisible();

    // Verify the text specifically says "Thank you for your order!".
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
