import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const purchaseRequestsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'purchase-requests.view'
      },

      loadComponent: () =>
        import(
          './pages/purchase-requests-list/purchase-requests-list.page'
        )
          .then(
            module =>
              module.PurchaseRequestsListPage
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
          'purchase-requests.create'
      },

      loadComponent: () =>
        import(
          './pages/purchase-requests-create/purchase-requests-create.page'
        )
          .then(
            module =>
              module.PurchaseRequestsCreatePage
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
          'purchase-requests.update'
      },

      loadComponent: () =>
        import(
          './pages/purchase-requests-edit/purchase-requests-edit.page'
        )
          .then(
            module =>
              module.PurchaseRequestsEditPage
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
          'purchase-requests.view'
      },

      loadComponent: () =>
        import(
          './pages/purchase-requests-detail/purchase-requests-detail.page'
        )
          .then(
            module =>
              module.PurchaseRequestsDetailPage
          )
    }
  ];
