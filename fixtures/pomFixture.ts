import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { BasePage } from '../pages/BasePage';
import { ApiClient } from '../lib/api/ApiClient';

// Declare the types of your fixtures.
// This tells TypeScript that our custom 'test' function will have these specific page objects available in the arguments.
type Pages = {
  basePage: BasePage;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
  apiClient: ApiClient;
};

// Extend the basic Playwright 'test' object to include our custom fixtures.
// This is the core of Dependency Injection in Playwright.
export const test = base.extend<Pages>({
  // Define the 'basePage' fixture.
  // 'use' is a callback that you call to provide the value to the test.
  basePage: async ({ page }, use) => {
    // Instantiate BasePage with the current Playwright 'page' object.
    await use(new BasePage(page));
  },

  // Define the 'loginPage' fixture.
  loginPage: async ({ page }, use) => {
    // Instantiate LoginPage, which encapsulates login interactions.
    await use(new LoginPage(page));
  },

  // Define the 'inventoryPage' fixture.
  inventoryPage: async ({ page }, use) => {
    // Instantiate InventoryPage, which encapsulates product list interactions.
    await use(new InventoryPage(page));
  },

  // Define the 'checkoutPage' fixture.
  checkoutPage: async ({ page }, use) => {
    // Instantiate CheckoutPage, which encapsulates the checkout process.
    await use(new CheckoutPage(page));
  },

  // Define the 'apiClient' fixture.
  apiClient: async ({ request }, use) => {
    // Instantiate ApiClient with the Playwright request context.
    await use(new ApiClient(request));
  },
});

// Re-export 'expect' so we can import everything from this one file in our tests.
export { expect } from '@playwright/test';
