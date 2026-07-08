import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CountryRepository } from './domain/categories/country/repositories/country.repository';
import { CountryRepositoryImpl } from './infrastructure/repositories/categories/country/country.repository.impl';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { responseInterceptor } from './core/interceptors/response-interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { AuthRepository } from './domain/auth/repositories/auth.repository';
import { AuthRepositoryImpl } from './infrastructure/repositories/auth/auth.repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([responseInterceptor, authInterceptor])),
    provideAnimationsAsync(),
    provideToastr({
      positionClass: 'toast-top-right', //* vị trí
      timeOut: 3000, //* tự tắt sau 3s
      progressBar: true, //* thanh chạy
      preventDuplicates: true, //* tránh spam
      enableHtml: true, //* cho phép HTML trong nội dung
      newestOnTop: true, //* hiển thị thông báo mới nhất ở trên cùng
    }),
    { provide: CountryRepository, useClass: CountryRepositoryImpl },
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
  ],
};
