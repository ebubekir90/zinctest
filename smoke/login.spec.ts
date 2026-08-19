import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../utils/test-data';

// A very small sanity check that runs through Playwright's own runner.
// It shows that the very same Page Object works with both runners.
test('User can log in with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(users.validUser.username, users.validUser.password);

  expect(await loginPage.isDashboardVisible()).toBe(true);
});
