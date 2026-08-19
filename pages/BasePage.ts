import { Page, Locator } from 'playwright';
import { config } from '../support/config';

/**
 * Base class for every Page Object.
 * It holds the shared Playwright `page` instance and common UI helpers so that
 * specific pages only need to define their own locators and business methods.
 *
 * Every helper relies on Playwright's built-in auto-waiting - there are no
 * hard `waitForTimeout` sleeps.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path on the configured base URL. */
  async navigate(path = '/'): Promise<void> {
    await this.page.goto(`${config.baseUrl}${path}`, {
      waitUntil: 'domcontentloaded'
    });
  }

  /** Fill a text/input field. */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /** Click an element. */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /** Return the trimmed inner text of an element. */
  async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }

  /** Return whether an element is currently visible (no waiting). */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /**
   * Wait until an element is visible.
   * Throws if it does not appear within the timeout.
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: timeout ?? config.timeout
    });
  }

  /** A shortcut to create a locator from a CSS/text selector. */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}
