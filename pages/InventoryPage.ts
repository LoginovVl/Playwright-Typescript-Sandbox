import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// InventoryPage represents the product catalog/inventory page of the application.
export class InventoryPage extends BasePage {
  // Define locators for elements on the inventory page.
  readonly inventoryList: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    // Locator for the container holding all inventory items (using class selector).
    this.inventoryList = page.locator('.inventory_list');

    // Locator for the page title text (e.g., "Products").
    this.pageTitle = page.locator('.title');
  }

  // Method to add a specific item to the cart by its name.
  async addItemToCart(itemName: string) {
    await this.inventoryList
      .locator('.inventory_item')
      .filter({ hasText: itemName })
      .locator('button')
      .click();
  }
}
