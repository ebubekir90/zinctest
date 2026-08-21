import { defineConfig, devices } from '@playwright/test';

// Optional configuration for Playwright's own test runner.
// It is only used by the `npm run test:smoke` script. The primary BDD
// runner is Cucumber (see cucumber.js) which launches the browser itself.
export default defineConfig({
  testDir: './smoke',
  timeout: 30_000,
  retries: 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://zincbank.cydeo.io/',
    headless: false,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
