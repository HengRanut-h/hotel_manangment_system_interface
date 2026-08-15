import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const stockTransactionsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'stock-transactions.view'
      },

      loadComponent: () =>
        import(
          './pages/stock-transactions-list/stock-transactions-list.page'
        )
          .then(
            module =>
              module.StockTransactionsListPage
          )
    },

    {
      path:
        'create',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'stock-transactions.create'
      },

      loadComponent: () =>
        import(
          './pages/stock-transactions-create/stock-transactions-create.page'
        )
          .then(
            module =>
              module.StockTransactionsCreatePage
          )
    },

    {
      path:
        ':id/edit',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'stock-transactions.update'
      },

      loadComponent: () =>
        import(
          './pages/stock-transactions-edit/stock-transactions-edit.page'
        )
          .then(
            module =>
              module.StockTransactionsEditPage
          )
    },

    {
      path:
        ':id',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'stock-transactions.view'
      },

      loadComponent: () =>
        import(
          './pages/stock-transactions-detail/stock-transactions-detail.page'
        )
          .then(
            module =>
              module.StockTransactionsDetailPage
          )
    }
  ];
