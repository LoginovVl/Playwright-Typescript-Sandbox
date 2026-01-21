import { Locator, Page } from '@playwright/test';

export class Header {
    readonly page: Page;
    readonly shoppingCartBadge: Locator;
    readonly menuButton: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.shoppingCartBadge = page.locator('.shopping_cart_link');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
    }

    async goToCart() {
        await this.shoppingCartBadge.click();
    }

    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }
}
