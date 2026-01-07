import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// InventoryPage represents the product catalog/inventory page of the application.
export class InventoryPage extends BasePage {
    // Define locators for elements on the inventory page.
    readonly inventoryList: Locator;
    readonly shoppingCartBadge: Locator;
    readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        // Locator for the container holding all inventory items (using class selector).
        this.inventoryList = page.locator('.inventory_list');

        // Locator for the shopping cart icon/badge.
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');

        // Locator for the page title text (e.g., "Products").
        this.pageTitle = page.locator('.title');
    }

    // Method to add a specific item to the cart by its name.
    // This demonstrates how to handle dynamic lists of items.
    async addItemToCart(itemName: string) {
        // First, find all elements with class '.inventory_item'.
        // Then, .filter() narrows down checks to only the one that contains the text 'itemName'.
        // Finally, inside that specific item, find the 'button' element.
        // This chain ensures we click the "Add to cart" button for the correct product.
        await this.page.locator('.inventory_item')
            .filter({ hasText: itemName })
            .locator('button')
            .click();
    }

    // Method to navigate to the cart page by clicking the cart icon.
    async goToCart() {
        await this.shoppingCartBadge.click();
    }
}
