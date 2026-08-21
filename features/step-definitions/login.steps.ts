import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { users } from '../../utils/test-data';

// Steps contain only minimal glue logic - all real UI interaction
// happens inside the Page Objects.

Given('I navigate to the login page', async function (this: CustomWorld) {
  await this.loginPage.open();
});

When('I login with valid credentials', async function (this: CustomWorld) {
  await this.loginPage.login(users.validUser.email, users.validUser.password);
});

When('I login with invalid credentials', async function (this: CustomWorld) {
  await this.loginPage.login(users.invalidUser.email, users.invalidUser.password);
});

Then('I should see the dashboard', async function (this: CustomWorld) {
  assert.strictEqual(
    await this.loginPage.isDashboardVisible(),
    true,
    'Expected the dashboard to be visible after a successful login'
  );
});

Then('I should see an error message', async function (this: CustomWorld) {
  const message = await this.loginPage.getErrorMessage();
  assert.ok(
    message.length > 0,
    'Expected an error message to be shown for invalid credentials'
  );
});
