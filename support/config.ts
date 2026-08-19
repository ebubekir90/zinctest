import 'dotenv/config';
import { BrowserType, chromium, firefox, webkit } from 'playwright';

export interface Viewport {
  width: number;
  height: number;
}

/**
 * Central configuration object.
 * Every value can be overridden through environment variables (see .env).
 * Defaults keep the framework runnable without any environment setup.
 */
export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  browser: process.env.BROWSER ?? 'chromium',
  headless: (process.env.HEADLESS ?? 'true').toLowerCase() === 'true',
  timeout: Number(process.env.TIMEOUT ?? 15000),
  viewport: { width: 1280, height: 720 } as Viewport
};

/**
 * Maps the configured browser name to the matching Playwright browser type.
 * Valid values: 'chromium' | 'firefox' | 'webkit'
 */
export function getBrowserType(): BrowserType {
  switch (config.browser) {
    case 'firefox':
      return firefox;
    case 'webkit':
      return webkit;
    case 'chromium':
    default:
      return chromium;
  }
}
