import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CountryRepository } from './domain/categories/country/repositories/country.repository';
import { CountryRepositoryImpl } from './infrastructure/repositories/categories/country/country.repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: CountryRepository, useClass: CountryRepositoryImpl },
  ],
};
