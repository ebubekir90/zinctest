# Basic UI Test Automation Framework

A clean, beginner-friendly **UI test automation framework** that combines
**Playwright**, **TypeScript**, **Cucumber BDD**, and the **Page Object Model (POM)**.

It is intentionally kept simple and well-organised so that a new tester can
understand it quickly, run it, and extend it.

> The example tests run against the public demo application
> [Sauce Demo](https://www.saucedemo.com), so the whole framework is executable
> out of the box. Replace the URL and selectors with your own application's
> values when you are ready to point it at real software.

---

## Technologies

| Technology | Purpose |
|------------|---------|
| [Playwright](https://playwright.dev) | Cross-browser automation (Chromium, Firefox, WebKit) |
| [TypeScript](https://www.typescriptlang.org) | Typed application code |
| [Cucumber BDD](https://cucumber.io) (@cucumber/cucumber) | Gherkin feature files + step definitions |
| [Allure](https://allure.qatools.ru) | Rich test reporting (HTML report + raw results) |
| Page Object Model | Clean separation between locators and test logic |
| Node.js + npm | Runtime and package management |

---

## Installation

Requirements: **Node.js 18+** and **npm**.

```bash
# 1. Install the JavaScript dependencies
npm install

# 2. Install the browser binaries used by Playwright
npx playwright install

# (Optional) install only a single browser, e.g.
npx playwright install chromium
```

> The first browser download can take a few minutes.

---

## Project structure

```text
automation-framework/
│
├── features/                      # Gherkin feature files (business-readable)
│   ├── login.feature
│   └── step-definitions/          # Step definitions (thin glue logic)
│       └── login.steps.ts
│
├── pages/                         # Page Object Model
│   ├── BasePage.ts                # Shared/common UI helpers
│   └── LoginPage.ts               # Login page locators + actions
│
├── hooks/
│   └── hooks.ts                   # Browser lifecycle + screenshot on failure
│
├── support/                       # Framework plumbing
│   ├── world.ts                   # Custom Cucumber World
│   └── config.ts                  # Central configuration
│
├── utils/
│   └── test-data.ts               # Reusable test data
│
├── smoke/                         # (Optional) Playwright-runner smoke test
│   └── login.spec.ts
│
├── reports/                       # Generated reports: cucumber-report.html, allure-results/, allure-report/
├── screenshots/                   # Screenshots of failed scenarios
│
├── cucumber.js                    # Cucumber configuration
├── playwright.config.ts           # (Optional) Playwright runner configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies + npm scripts
├── .env / .env.example            # Environment configuration
├── .gitignore
└── README.md
```

---

## How the framework works

1. **Cucumber** reads the `.feature` files written in Gherkin.
2. Each Gherkin step is matched to a **step definition** in
   `features/step-definitions`.
3. A step definition calls a method on a **Page Object**
   (e.g. `loginPage.login(...)`).
4. The Page Object uses **Playwright** locators/actions to drive the browser.
5. **Hooks** set up the browser/context/page before each scenario and tear it
   down afterwards (taking a screenshot and attaching it to the HTML report if
   the scenario failed).

Data flows like this:

```text
login.feature  -->  login.steps.ts  -->  LoginPage.ts  -->  Playwright  -->  Browser
        (Gherkin)        (step defs)        (POM)            (automation)     (UI)
```

This separation keeps feature files readable, step definitions thin, and all
locators inside Page Objects.

---

## Configuration

All configuration is centralised in `support/config.ts` and can be overridden
with environment variables (loaded from a `.env` file via `dotenv`).

| Variable   | Default                     | Description                             |
|------------|-----------------------------|-----------------------------------------|
| `BASE_URL` | `https://www.saucedemo.com` | Base URL of the application under test  |
| `BROWSER`  | `chromium`                  | `chromium`, `firefox` or `webkit`       |
| `HEADLESS` | `true`                      | `true` or `false` for headed mode       |
| `TIMEOUT`  | `15000`                     | Default timeout (ms) for waits          |

To change a value, either edit the `.env` file, or set it inline when running
a command (see the npm scripts below). The same configuration drives the
Cucumber run and the optional Playwright smoke run.

---

## npm scripts

Run the full Cucumber BDD suite in headless mode:

```bash
npm test
```

Run the tests **headed** (visible browser window):

```bash
npm run test:headed
```

Select a specific **browser**:

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

Run the optional, fast **Playwright** (non-Cucumber) smoke test:

```bash
npm run test:smoke
# run the smoke test against a single browser project, e.g.
npm run test:smoke -- --project=chromium
```

Type-check the whole project (no tests run):

```bash
npm run typecheck
```

**Reporting** – every `npm test` run writes a self-contained HTML report to
`reports/cucumber-report.html`. Open it directly in your browser, or serve it:

```bash
npm run report      # serves ./reports and opens it in your browser
```

Clean generated folders (report + screenshots):

```bash
npm run clean
```

---

## Selecting a browser / headed vs headless

You generally do **not** need to touch config values for the common cases —
use the npm scripts above.

If you prefer environment variables:

```bash
# Windows (cmd)
set BROWSER=firefox && set HEADLESS=false && npm test

# macOS / Linux
BROWSER=firefox HEADLESS=false npm test
```

> `cross-env` is included so the `npm run test:*` scripts work identically on
> Windows, macOS, and Linux.

---

## Reports

- The built-in Cucumber **html** formatter produces
  `reports/cucumber-report.html`.
- The console summary shows the number of passed/failed scenarios and steps.

For **failed scenarios**:

- a screenshot is saved to `screenshots/<scenario-name>-<timestamp>.png`, and
- the same screenshot is embedded in the HTML report via `this.attach(...)`.

Because screenshots are stored under `reports/` and `screenshots/`, both are
git-ignored (clean repos, no bulky artifacts).

---

## Screenshots

- Screenshots are only taken when a scenario **fails** (handled in
  `hooks/hooks.ts`).
- The `After` hook decides whether the scenario failed by checking
  `scenario.result.status === Status.FAILED`.
- Existing screenshots are not overwritten (each filename includes a timestamp).

---

## How to create a new Feature

1. Create a file under `features/`, e.g. `features/search.feature`.
2. Write it in business-friendly Gherkin:

```gherkin
Feature: Search

  Scenario: Search for a product
    Given I am on the home page
    When I search for "laptop"
    Then I should see search results
```

1. Add matching step definitions (next section).

> Keep implementation details (selectors, URLs) out of `.feature` files –
> they belong in Page Objects.

---

## How to create a new Page Object

1. Create a file under `pages/`, e.g. `pages/SearchPage.ts`.
2. Extend `BasePage` and hold locators as private fields:

```ts
import { Locator } from 'playwright';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  private readonly searchInput: Locator = this.page.getByPlaceholder('Search');
  private readonly searchButton: Locator = this.page.getByRole('button', { name: 'Search' });
  private readonly results: Locator = this.page.locator('.search-results');

  async open(): Promise<void> {
    await this.navigate('/');
  }

  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.click(this.searchButton);
  }

  async areResultsVisible(): Promise<boolean> {
    return this.isVisible(this.results);
  }
}
```

1. Register it on the World in `support/world.ts` (add the property to
   `CustomWorld` and the class). Then create it in the `Before` hook in
   `hooks/hooks.ts`.

---

## How to create new Step Definitions

Create a file under `features/step-definitions/` (e.g.
`search.steps.ts`) and use `this.<pageObject>` from the World:

```ts
import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Given('I am on the home page', async function (this: CustomWorld) {
  await this.searchPage.open();
});

When('I search for {string}', async function (this: CustomWorld, query: string) {
  await this.searchPage.search(query);
});

Then('I should see search results', async function (this: CustomWorld) {
  assert.strictEqual(await this.searchPage.areResultsVisible(), true);
});
```

New step definition files are picked up automatically because `cucumber.js`
loads `features/step-definitions/**/*.ts`.

---

## Custom Cucumber World

`support/world.ts` defines a custom World so every step and hook has direct,
type-safe access to the browser artifacts and Page Objects.

Currently available on `this`:

```ts
this.browser    // the shared Playwright Browser instance
this.context    // the BrowserContext for the current scenario
this.page       // the Page for the current scenario
this.loginPage  // an instance of LoginPage bound to this.page
```

Add more Page Objects here as your suite grows.

---

## Hooks

`hooks/hooks.ts` manages the lifecycle:

- `BeforeAll` – launches a single browser (configured via `config`).
- `Before` – creates a fresh browser context + page and the Page Objects for
  each scenario.
- `After` – on failure, attaches a screenshot to the Cucumber HTML report and
  the Allure report, saves a copy to `screenshots/`, then always closes the
  context.
- `AfterAll` – closes the shared browser.

A **single** browser is launched for the entire run and reused across all
scenarios (a new context/page per scenario) — a browser is never created per
step.

---

## Architecture rules

1. Feature files contain only business-readable Gherkin.
2. Step definitions stay thin (minimal logic).
3. Page Objects hold locators and UI interaction methods.
4. Common UI actions live in `BasePage`.
5. Test data is separated from test logic (`utils/test-data.ts`).
6. Configuration is centralised (`support/config.ts` + `.env`).
7. Hooks manage the test lifecycle.
8. No duplicated locators, no `any`, no hard-coded paths/URLs in tests.
9. No hard waits (`waitForTimeout`) — Playwright's auto-waiting is used.
10. `async/await` is used consistently and functions stay small and reusable.

---

## First run (exact commands)

```bash
npm install
npx playwright install chromium

npm test
```

Expected output (against the demo app):

```text
2 scenarios (2 passed)
10 steps (10 passed)
```

Then open the report:

```bash
npm run report
```

---

## Allure Reporting

Besides the self-contained Cucumber HTML report, the framework ships an
[Allure](https://allure.qatools.ru) reporter. Allure provides a lovely,
searchable HTML report with graphs, timelines, and per-step detail.

### Quick start

```bash
# 1. Run the tests (raw Allure results are written and kept in reports/allure-results/)
npm test

# 2. Generate the static HTML report into reports/allure-report/
npm run report:allure

# 3. Serve it locally in your default browser
npm run open:allure
```

### How it is wired

- `cucumber.js` registers the `allure-cucumberjs/reporter` formatter and points
  its `resultsDir` at `reports/allure-results`. It also supplies an
  `environmentInfo` block (Node version, OS/platform, hostname) shown on the
  Allure Overview page.
- Reproducing Allure reports requires **Java 8+** (used by the Allure
  command-line tool). You can still view consumed results directly by opening
  `reports/allure-report/index.html`.

### Screenshots on failure

Screenshots of failed scenarios are captured in the `After` hook
(`hooks/hooks.ts`) and attached with `world.attach(screenshot, 'image/png')`.
Because `allure-cucumberjs` automatically captures Cucumber attachments, the
Screenshot shows up in **both** the Cucumber HTML report and the failing test's
tear-down (After) section in Allure. A copy is also saved to `screenshots/`.

> Note: the `allure-js-commons` facade (`allure.attachment(...)`) is **not**
> used for screenshots. With a custom Cucumber `World`, that facade does not
> bind to an active Allure test runtime, so it silently no-ops. Relying on
> `world.attach` keeps the screenshot in every report reliably.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run report:allure` | Generate `reports/allure-report/` from `reports/allure-results/` (`--clean`) |
| `npm run open:allure` | Open the generated Allure report in the browser |
| `npm run clean` | Remove all generated reports and screenshots |

---

## Running on GitHub (CI)

The repository includes a GitHub Actions workflow
(`.github/workflows/ci.yml`) that:

1. On every push to `main` (also on pull requests and manual runs):
   - installs dependencies (`npm ci`) and Chromium (`npx playwright install`),
   - runs the full test suite (`npm test`),
   - generates the Allure report (`npm run report:allure`).
2. Uploads the Allure report, the raw Allure results, and the Cucumber HTML
   report as downloadable **artifacts**.
3. On `main`, deploys the Allure report to the `gh-pages` branch so it can be
   served publicly via **GitHub Pages**.

To get started on GitHub after pushing:

1. Open your repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Set the **Branch** to `gh-pages` and the folder to `/ (root)`, then **Save**.
4. Every new push to `main` will re-run the tests and refresh the published
   Allure report at `https://<your-user>.github.io/<your-repo>/`.

> Note: the Allure CLI needs a JVM, so the workflow installs **Java 17**
> (`actions/setup-java`) before generating the report.

---

## Troubleshooting

- **`Executable doesn't exist`** – run `npx playwright install` to download the
  browsers.
- **Scenarios fail against a different app** – update `BASE_URL` in `.env` and
  the locators in the Page Objects.
- **No browser window shows** – use `npm run test:headed`.

