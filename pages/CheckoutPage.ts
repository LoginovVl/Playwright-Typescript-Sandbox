import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// CheckoutPage handles the multi-step checkout process: Cart -> Info -> Finish.
export class CheckoutPage extends BasePage {
    // Locators for various elements across the checkout flow.
    readonly checkoutButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly completeHeader: Locator;

    constructor(page: Page) {
        super(page);
        // -- Cart Page Elements --
        // Button to proceed from Cart to Checkout Step One.
        this.checkoutButton = page.locator('#checkout');

        // -- Checkout Step One (Information) Elements --
        // Input for first name.
        this.firstNameInput = page.locator('#first-name');
        // Input for last name.
        this.lastNameInput = page.locator('#last-name');
        // Input for logging postal code.
        this.postalCodeInput = page.locator('#postal-code');
        // Button to proceed to Overview step.
        this.continueButton = page.locator('#continue');

        // -- Checkout Step Two (Overview) Elements --
        // Button to finalize the order.
        this.finishButton = page.locator('#finish');

        // -- Finish Page Elements --
        // Header text confirming the order (e.g., "Thank you for your order!").
        this.completeHeader = page.locator('.complete-header');
    }

    // Clicks the checkout button on the Cart page.
    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    // Fills out the checkout information form.
    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        // Fill First Name.
        await this.firstNameInput.fill(firstName);
        // Fill Last Name.
        await this.lastNameInput.fill(lastName);
        // Fill Zip/Postal Code.
        await this.postalCodeInput.fill(postalCode);
        // Click Continue to go to the next step.
        await this.continueButton.click();
    }

    // Clicks the Finish button to complete the purchase.
    async finishCheckout() {
        await this.finishButton.click();
    }
}
