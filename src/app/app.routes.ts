import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/shell-layout').then(
        (m) => m.ShellLayout,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard').then(
            (m) => m.DashboardPage,
          ),
      },
      {
        path: 'apps/:appId',
        loadComponent: () =>
          import('./features/apps/pages/app-detail/app-detail').then(
            (m) => m.AppDetailPage,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
