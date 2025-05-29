import { test, expect, Page } from '@playwright/test';

// Helper function to set up authenticated state
async function setupAuthenticatedUser(page: Page) {
  const fakeUser = {
    id: 1,
    email: 'test@example.com',
    username: 'test@example.com',
  };

  // Mock ALL API requests before any navigation
  await page.route('**/*', (route) => {
    const url = route.request().url();

    // Mock profile endpoint
    if (url.includes('/api/profile')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeUser),
      });
      return;
    }

    // Mock campaigns endpoint
    if (url.includes('/api/campaigns')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }

    // Let all other requests continue normally
    route.continue();
  });

  // Set up authentication state
  await page.addInitScript(([user]) => {
    localStorage.setItem('access_token', 'mocked-access-token');
    localStorage.setItem('refresh_token', 'mocked-refresh-token');
    localStorage.setItem('user', user);
  }, [JSON.stringify(fakeUser)]);

  return fakeUser;
}

test('visit dashboard when authenticated', async ({ page }) => {
  const fakeUser = await setupAuthenticatedUser(page);

  // Navigate to home page and wait for the page to be fully loaded
  await page.goto('/', { waitUntil: 'networkidle' });

  // More reliable approach: wait for the dashboard content to appear
  // This ensures authentication has completed successfully
  await expect(page.getByText(/Campaign Management Portal/)).toBeVisible({ timeout: 15000 });

  // Verify user email is displayed in the UI
  await expect(page.getByText(fakeUser.email)).toBeVisible({ timeout: 5000 });

  // Additional verification: ensure we didn't get redirected to signin
  expect(page.url()).not.toContain('/signin');
});
