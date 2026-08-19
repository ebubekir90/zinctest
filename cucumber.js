// Cucumber configuration (CommonJS).
// TypeScript support code is transpiled on the fly using tsx (see tsconfig.json).
const os = require('node:os');
const process = require('node:process');

module.exports = {
  default: {
    // Register tsx so Cucumber can `require()` .ts files directly.
    // We use `require` + `requireModule` because our project is CommonJS.
    requireModule: ['tsx/cjs'],
    require: [
      'support/**/*.ts',
      'hooks/**/*.ts',
      'features/step-definitions/**/*.ts'
    ],
    // Where to look for .feature files.
    paths: ['features/'],
    // Console output + a self-contained HTML report + Allure raw results.
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      // Where Allure writes its raw results (consumed by `npm run report:allure`).
      resultsDir: 'reports/allure-results',
      // Machine/run info shown on the Allure Overview page.
      environmentInfo: {
        node: process.version,
        platform: `${os.platform()} ${os.release()}`,
        hostname: os.hostname()
      }
    },
    // Stop Cucumber nagging about publishing reports online.
    publishQuiet: true
  }
};
