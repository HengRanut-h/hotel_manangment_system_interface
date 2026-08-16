
import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const invoicesRoutes: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: {
      permission: 'invoices.view'
    },
    loadComponent: () =>
      import(
        './pages/invoices-list/invoices-list.page'
      ).then(
        module =>
          module.InvoicesListPage
      )
  },

  {
    path: 'create',
    canActivate: [permissionGuard],
    data: {
      permission: 'invoices.create'
    },
    loadComponent: () =>
      import(
        './pages/invoices-create/invoices-create.page'
      ).then(
        module =>
          module.InvoicesCreatePage
      )
  },

  {
    path: 'outstanding',
    canActivate: [permissionGuard],
    data: {
      permission: 'invoices.view'
    },
    loadComponent: () =>
      import(
        './pages/invoices-outstanding/invoices-outstanding.page'
      ).then(
        module =>
          module.InvoicesOutstandingPage
      )
  },

  {
    path: 'analytics',
    canActivate: [permissionGuard],
    data: {
      permission: 'invoices.view'
    },
    loadComponent: () =>
      import(
        './pages/invoices-analytics/invoices-analytics.page'
      ).then(
        module =>
          module.InvoicesAnalyticsPage
      )
  },

  {
    path: ':id',
    canActivate: [permissionGuard],
    data: {
      permission: 'invoices.view'
    },
    loadComponent: () =>
      import(
        './pages/invoices-detail/invoices-detail.page'
      ).then(
        module =>
          module.InvoicesDetailPage
      )
  }
];
