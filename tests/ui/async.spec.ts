import { test, expect } from '@fixtures/pomFixture';

test.describe('Advanced Async Patterns', () => {

    test('should wait for non-deterministic state change using expect.poll', async ({ page }) => {
        // 1. Simulate a background process by injecting a script into the page.
        // This script sets a window variable 'window.processingStatus' to 'Processing...' 
        // and changes it to 'Completed' after a random delay (1-3 seconds).
        await page.evaluate(() => {
            (window as any).processingStatus = 'Processing...';
            setTimeout(() => {
                (window as any).processingStatus = 'Completed';
            }, Math.floor(Math.random() * 2000) + 1000); // 1-3 sec delay
        });

        // 2. Use expect.poll to retry checking the value until it matches.
        // Standard expect(locator).toHaveText() auto-retries for DOM elements.
        // expect.poll is needed for *non-DOM* values (like window variables, API responses, or DB states).
        await expect.poll(async () => {
            return await page.evaluate(() => (window as any).processingStatus);
        }, {
            // Optional configuration
            message: 'Waiting for processing status to become Completed',
            timeout: 5000, // Fail if not completed in 5s
            intervals: [500], // Retry every 500ms
        }).toBe('Completed');
    });

    test('should handle artificial network loading delays', async ({ page, loginPage }) => {
        // 1. Intercept the login request to the backend validation service (in this demo app, it's just a navigation)
        // Since SauceDemo is static, we'll delay the main document navigation or asset loading.
        // For a better demo, we'll delay the CSS to verify the page loads content even if styling is slow, 
        // OR we can delay the 'inventory.html' navigation request.

        await page.route('**/inventory.html', async route => {
            // Add a 2-second delay before continuing the request
            await new Promise(resolve => setTimeout(resolve, 2000));
            await route.continue();
        });

        await loginPage.navigate('/');

        // This action triggers the navigation which we have delayed.
        const loginPromise = loginPage.login('standard_user', 'secret_sauce');

        // While waiting for login, we can assert initial states (e.g., button might be disabled if it was a real app)
        // Here we just await the promise.
        await loginPromise;

        // Even with the delay, Playwright's auto-waiting should handle it gracefully.
        // We verify we eventually landed on the inventory page.
        await expect(page).toHaveURL(/.*inventory.html/, { timeout: 10000 });
    });

    test('should capture console logs', async ({ page, consoleLogs }) => {
        await page.evaluate(() => {
            console.log('Hello from the browser!');
            console.warn('This is a warning');
        });

        // Verify that our fixture captured the logs
        expect(consoleLogs).toContain('Hello from the browser!');
        expect(consoleLogs).toContain('This is a warning');
    });

});
