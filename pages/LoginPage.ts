import { Locator } from 'playwright';
import { BasePage } from './BasePage';

/**
 * Page Object for the ZincBank login page.
 * All locators live here - never inside Cucumber step definitions.
 *
 * Locators use the application's stable `data-testid` attributes:
 *   - Email input   : login-email-input
 *   - Password input: login-password-input
 *   - Submit button : login-submit
 *   - Error banner  : login-error
 * A successful login navigates to /dashboard.
 */
export class LoginPage extends BasePage {
  private readonly emailInput: Locator = this.page.getByTestId('login-email-input');
  private readonly passwordInput: Locator = this.page.getByTestId('login-password-input');
  private readonly loginButton: Locator = this.page.getByTestId('login-submit');
  private readonly errorMessage: Locator = this.page.getByTestId('login-error');
  private readonly dashboard: Locator = this.page.getByTestId('dashboard-welcome');

  /** Open the login page. */
  async open(): Promise<void> {
    await this.navigate('/login');
    // Next.js/React hydrates the controlled inputs after `domcontentloaded`.
    // WebKit hydrates slowly, so filling immediately can get wiped back to the
    // empty default. Wait until the network settles so hydration has finished.
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async fillEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  /** A single actionable method that logs a user in. */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
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

  /**
   * Whether the dashboard is visible after login.
   * A successful login redirects to /dashboard, so we wait for the URL to
   * change away from /login and for the dashboard page element to appear.
   */
  async isDashboardVisible(): Promise<boolean> {
  try {
    // Elementin dom'a gelmesini ve görünür olmasını max timeout kadar bekler
    await this.dashboard.waitFor({ state: 'visible', timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}
}
