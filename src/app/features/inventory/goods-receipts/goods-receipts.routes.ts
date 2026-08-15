import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const goodsReceiptsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'goods-receipts.view'
      },

      loadComponent: () =>
        import(
          './pages/goods-receipts-list/goods-receipts-list.page'
        )
          .then(
            module =>
              module.GoodsReceiptsListPage
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
          'goods-receipts.create'
      },

      loadComponent: () =>
        import(
          './pages/goods-receipts-create/goods-receipts-create.page'
        )
          .then(
            module =>
              module.GoodsReceiptsCreatePage
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
          'goods-receipts.update'
      },

      loadComponent: () =>
        import(
          './pages/goods-receipts-edit/goods-receipts-edit.page'
        )
          .then(
            module =>
              module.GoodsReceiptsEditPage
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
          'goods-receipts.view'
      },

      loadComponent: () =>
        import(
          './pages/goods-receipts-detail/goods-receipts-detail.page'
        )
          .then(
            module =>
              module.GoodsReceiptsDetailPage
          )
    }
  ];
