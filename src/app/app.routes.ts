import { Routes } from '@angular/router';
import { LayoutMain } from './shared/layout/layout-main/layout-main';
import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/account/account').then((m) => m.Account),
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: LayoutMain,
    canActivate: [authGuard],
    children: [
      {
        path: 'country',
        loadComponent: () =>
          import('./features/categories/country/pages/country-list/country-list').then(
            (c) => c.CountryList,
          ),
      },
    ],
  },
];
