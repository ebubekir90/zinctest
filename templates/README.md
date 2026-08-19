# Reusable bits — how to reuse this project's tooling in another repo
# ====================================================================

These files are project-agnostic. Copy the ones you need into a new project,
adjust the commands/paths, and you're done.

## 1) "npm run push" shortcut (add + commit + push)
- Copy `push.js` into your project as `scripts/push.js`.
- Add this to your `package.json` scripts:
  ```json
  "push": "node scripts/push.js"
  ```
- Then use:
  ```bash
  npm run push                  # auto commit message
  npm run push -- "my message"  # custom commit message
  ```

## 2) GitHub Actions CI
- Copy `ci.yml` into `.github/workflows/ci.yml`.
- Edit the `run:` lines to match your project (test runner, report command...).

## 3) .gitignore
- Copy `gitignore` and rename it to `.gitignore`.
- This keeps secrets (`.env`) and generated folders (node_modules, reports,
  screenshots, test-results) out of git.

## 4) Allure reporting (only if the new project also uses Cucumber/Playwright)
Replicate the same setup as this repo's `cucumber.js` and `hooks/hooks.ts`:
- Install: `npm i -D allure-cucumberjs allure-js-commons allure-commandline`
- Add `allure-cucumberjs/reporter` to the Cucumber `format` array with
  `formatOptions.resultsDir = 'reports/allure-results'`.
- Add package scripts:
  ```json
  "report:allure": "allure generate reports/allure-results -o reports/allure-report --clean",
  "open:allure": "allure open reports/allure-report"
  ```
- CI must install Java (`actions/setup-java`) for the Allure CLI.

## What is NOT reusable (must be rewritten per project)
- `features/*.feature`, `features/step-definitions/*.ts`, `pages/*.ts`
- `support/world.ts`, `support/config.ts`, `hooks/hooks.ts`
- Page-specific selectors and business logic.
