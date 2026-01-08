import { test as setup, expect } from '@fixtures/pomFixture';
import path from 'path';

// Define the path where the authentication state (cookies, local storage) will be saved.
// This matches the 'storageState' config we will add to playwright.config.ts.
const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ loginPage, page }) => {
  // Perform login using our existing Page Object.
  await loginPage.navigate('/');
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify we are logged in (sanity check before saving).
  await expect(page).toHaveURL(/.*inventory.html/);

  // Save the state of the browser context (cookies, storage) to the file.
  await page.context().storageState({ path: authFile });
});
