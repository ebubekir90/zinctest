import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { LoginPage } from '../pages/LoginPage';

/**
 * The shape every Cucumber scenario can rely on.
 * You can add new Page Objects here as your framework grows.
 */
export interface CustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  loginPage: LoginPage;
}

/**
 * Custom Cucumber World.
 * The browser is created in hooks/hooks.ts; the World gives every step
 * convenient access to the page and the Page Objects.
 */
export class WorldClass extends World implements CustomWorld {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public loginPage!: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(WorldClass);
