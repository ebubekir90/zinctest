import { Locator } from 'playwright';
import { BasePage } from './BasePage';

/**
 * Page Object for the Sauce Demo login page.
 * All locators live here - never inside Cucumber step definitions.
 */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator = this.page.getByPlaceholder('Username');
  private readonly passwordInput: Locator = this.page.getByPlaceholder('Password');
  private readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
  private readonly errorMessage: Locator = this.page.locator('[data-test="error"]');
  private readonly productsTitle: Locator = this.page.locator('[data-test="title"]');

  /** Open the login page. */
  async open(): Promise<void> {
    await this.navigate('/');
  }

  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  /** A single actionable method that logs a user in. */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /** Whether the error banner (shown for bad credentials) is visible. */
  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  /** The text of the error banner, if any. */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /** Whether the dashboard ("Products" heading) is visible after login. */
  async isDashboardVisible(): Promise<boolean> {
    return this.isVisible(this.productsTitle);
  }
}
