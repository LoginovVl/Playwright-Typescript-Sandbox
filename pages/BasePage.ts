import { Page } from '@playwright/test';

// BasePage serves as a parent class for all other Page Objects.
// It contains properties and methods shared across the entire application (e.g., the 'page' object itself, navigation).
export class BasePage {
  // A property to hold the Playwright Page object.
  // 'readonly' ensures it cannot be reassigned after the constructor.
  readonly page: Page;

  // The constructor receives the Playwright Page instance (passed from the test/fixture)
  // and assigns it to the class property.
  constructor(page: Page) {
    this.page = page;
  }

  // A common method to navigate to a URL.
  // 'path' is a string that will be appended to the baseURL defined in playwright.config.ts.
  async navigate(path: string) {
    // Uses Playwright's goto method to load the page.
    await this.page.goto(path);
  }

  // A common method to retrieve the current page title.
  // This wraps the Playwright method for easier access in page objects.
  async getTitle() {
    return await this.page.title();
  }

  // A utility wrapper for waiting/pausing the execution.
  // Generally avoided in production code in favor of auto-waiting locators, but useful for debugging.
  // ms: number of milliseconds to wait.
  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }
}
