import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const purchaseOrdersRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'purchase-orders.view'
      },

      loadComponent: () =>
        import(
          './pages/purchase-orders-list/purchase-orders-list.page'
        )
          .then(
            module =>
              module.PurchaseOrdersListPage
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
          'purchase-orders.create'
      },

      loadComponent: () =>
        import(
          './pages/purchase-orders-create/purchase-orders-create.page'
        )
          .then(
            module =>
              module.PurchaseOrdersCreatePage
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
          'purchase-orders.update'
      },

      loadComponent: () =>
        import(
          './pages/purchase-orders-edit/purchase-orders-edit.page'
        )
          .then(
            module =>
              module.PurchaseOrdersEditPage
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
          'purchase-orders.view'
      },

      loadComponent: () =>
        import(
          './pages/purchase-orders-detail/purchase-orders-detail.page'
        )
          .then(
            module =>
              module.PurchaseOrdersDetailPage
          )
    }
  ];
