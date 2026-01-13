import { test as base } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginPage } from '@pages/LoginPage';

// Declare the types of our auth fixtures
// Declare the types of our auth fixtures
type AuthTestOptions = {
    useWorkerAuth: boolean;
};

type AuthWorkerFixtures = {
    workerStorageState: string;
};

export const test = base.extend<AuthTestOptions, AuthWorkerFixtures>({
    // Default to true (use worker auth by default)
    useWorkerAuth: [true, { option: true }],

    // Define workerStorageState with 'worker' scope.
    // This will execute ONCE per worker process.
    workerStorageState: [async ({ browser }, use, workerInfo) => {
        // Skip authentication for API project as it uses a different base URL and doesn't need UI login
        if (workerInfo.project.name === 'api') {
            await use('');
            return;
        }

        // Use a unique file path for each worker to avoid collisions
        const id = workerInfo.workerIndex;
        // Use a persistent path relative to the project root, similar to before, but unique per worker.
        // Or use the outputDir as planned. Let's use playwright/.auth to keep it consistent with .gitignore
        const authDir = path.join(__dirname, '../playwright/.auth');
        if (!fs.existsSync(authDir)) {
            fs.mkdirSync(authDir, { recursive: true });
        }
        const fileName = path.join(authDir, `user-worker-${id}.json`);

        // Check if state already exists (optional: could skip login if valid, but safer to re-login)
        if (fs.existsSync(fileName)) {
            // Check if file is less than 5 minutes old, purely as an optimization example
            const stats = fs.statSync(fileName);
            const now = new Date().getTime();
            if (now - stats.mtimeMs < 5 * 60 * 1000) {
                await use(fileName);
                return;
            }
        }

        // Create a new page for authentication
        // IMPORTANT: Use a clean context, do not use the 'page' fixture here as it creates circular dependency issues in worker scope
        // We must pass the baseURL explicitly because the raw browser.newPage() doesn't inherit project config automatically
        const baseURL = workerInfo.project.use.baseURL;
        const page = await browser.newPage({ storageState: undefined, baseURL });

        // Perform Login
        const loginPage = new LoginPage(page);
        await loginPage.navigate('/');
        await loginPage.login('standard_user', 'secret_sauce');

        // Verify login success before saving state
        await loginPage.page.waitForURL(/.*inventory.html/);

        // Save state
        await page.context().storageState({ path: fileName });
        await page.close();

        // Pass the file path to the test
        await use(fileName);
    }, { scope: 'worker' }],

    // Override the default storageState fixture.
    // Respects the 'useWorkerAuth' option.
    storageState: async ({ workerStorageState, useWorkerAuth }, use) => {
        // If enabled AND we have a valid path (not empty string)
        if (useWorkerAuth && workerStorageState) {
            await use(workerStorageState);
        } else {
            await use({ cookies: [], origins: [] });
        }
    },
});

export { expect } from '@playwright/test';
