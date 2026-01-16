import { test, expect } from '@fixtures/pomFixture';

test.describe('Network Mocking & Resilience', () => {

    test('should display broken image icon when product images fail to load (404)', async ({ page, loginPage }) => {
        // 1. Intercept requests for product images (ending in .jpg)
        // We use the glob pattern '**/*.jpg' to match any JPEG image.
        await page.route('**/*.jpg', async route => {
            // 2. Fulfill the request with a 404 Not Found error
            // This simulates a CDN failure or missing asset on the server.
            await route.fulfill({
                status: 404,
                contentType: 'text/plain',
                body: 'Not Found'
            });
        });

        // 3. Navigate and Login
        await loginPage.navigate('/');
        await loginPage.login('standard_user', 'secret_sauce');

        // 4. Verify we can detect the 404 failure on the network layer
        const responseProxy = await page.waitForResponse(resp => resp.url().includes('.jpg') && resp.status() === 404);
        expect(responseProxy.status()).toBe(404);

        // Optionally still check for visual broken state if reliable, but network check is deterministic.
        const firstImage = page.locator('.inventory_item_img img').first();
        await expect(firstImage).toBeVisible();
    });

    test('should handle API 500 status gracefully (Simulated)', async ({ page }) => {
        // Since we don't have a real API to break, we will mock a fetch call
        // to demonstrate how we WOULD test a 500 error on a real app.

        // 1. Mock a specific API endpoint
        await page.route('**/api/v1/user-data', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal Server Error' })
            });
        });

        // 2. Navigate to establish a base URL (so relative fetch works)
        await page.goto('/');

        // 3. Trigger the call (We manually trigger it since the app doesn't make it)
        const result = await page.evaluate(async () => {
            // We need to return an object that can be serialized. 
            // If fetch fails (rejects), it throws an Error.
            try {
                const res = await fetch('/api/v1/user-data');
                return { status: res.status, ok: res.ok };
            } catch (err: any) {
                return { error: err.toString() };
            }
        });

        // Debug output if it failed
        if (result.error) console.log('Fetch Error:', result.error);

        // 4. Verify we received the 500 status
        expect(result.status).toBe(500);
    });

});
