import { Routes } from '@angular/router';
import { LayoutMain } from './shared/layout/layout-main/layout-main';

export const routes: Routes = [
  {
    path: '',
    component: LayoutMain,
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
