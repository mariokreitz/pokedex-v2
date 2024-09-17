import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * The main application configuration.
 *
 * @remarks
 * This configuration is used to bootstrap the application. It provides the
 * router and HTTP client to the application.
 *
 * @publicApi
 */
export const appConfig: ApplicationConfig = {
  /**
   * The providers for the application.
   *
   * @remarks
   * The providers are used to inject dependencies into the application.
   * In this case, we are injecting the router and HTTP client.
   */
  providers: [provideRouter(routes), provideHttpClient()],
};
