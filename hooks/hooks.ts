import { Before, After, BeforeAll, AfterAll, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { mkdirSync } from 'fs';
import { Browser } from 'playwright';
import { CustomWorld } from '../support/world';
import { config, getBrowserType } from '../support/config';
import { LoginPage } from '../pages/LoginPage';

// A single browser instance is launched once for the whole test run and
// reused across scenarios. A fresh isolated context + page is created for
// every scenario, so we never create a new browser per step.
let browser: Browser;

BeforeAll(async function () {
  browser = await getBrowserType().launch({
    headless:false,
  });
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({
    viewport: config.viewport
  });
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED) {
    await attachScreenshotOnFailure(this, scenario);
  }
  // Always close the context (and therefore the page) after each scenario.
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});

/**
 * Saves a screenshot of the failed scenario and attaches it to the report.
 */
async function attachScreenshotOnFailure(
  world: CustomWorld,
  scenario: ITestCaseHookParameter
): Promise<void> {
  const screenshot = await world.page.screenshot({ fullPage: true });

  // Embed the screenshot in the report (Cucumber HTML report and, via the
  // allure-cucumberjs formatter which captures cucumber attachments, Allure).
  await world.attach(screenshot, 'image/png');

  // Also write it to the screenshots folder for easy access.
  const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9-_]/g, '_');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  mkdirSync('screenshots', { recursive: true });
  await world.page.screenshot({
    path: `screenshots/${safeName}-${timestamp}.png`,
    fullPage: true
  });
}
