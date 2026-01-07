import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// LoginPage extends BasePage to inherit common functionality (like 'navigate').
export class LoginPage extends BasePage {
    // Define Locators as class properties.
    // Locators represent a way to find elements on the page. Storing them here keeps them organized and reusable.
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    // The constructor initializes the locators when the page object is created.
    constructor(page: Page) {
        // Call the parent class (BasePage) constructor first.
        super(page);

        // Initialize locators using CSS selectors.
        // 'page.locator' searches for the element but doesn't interact with it yet.
        // Selector '#user-name' finds an element with id="user-name".
        this.usernameInput = page.locator('#user-name');

        // Selector '#password' finds an element with id="password".
        this.passwordInput = page.locator('#password');

        // Selector '#login-button' finds an element with id="login-button".
        this.loginButton = page.locator('#login-button');

        // Selector '[data-test="error"]' finds an element with the attribute data-test="error".
        // Using data-test attributes is a best practice as they are less likely to change than classes or IDs.
        this.errorMessage = page.locator('[data-test="error"]');
    }

    // A helper method wrapping the login workflow.
    // This abstracts the complexity of the login steps from the test file.
    async login(username: string, password: string) {
        // Fill the username input field with the provided string.
        await this.usernameInput.fill(username);

        // Fill the password input field.
        await this.passwordInput.fill(password);

        // Click the login button to submit the form.
        await this.loginButton.click();
    }
}
