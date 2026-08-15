import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const warehousesRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'warehouses.view'
      },

      loadComponent: () =>
        import(
          './pages/warehouses-list/warehouses-list.page'
        )
          .then(
            module =>
              module.WarehousesListPage
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
          'warehouses.create'
      },

      loadComponent: () =>
        import(
          './pages/warehouse-create/warehouse-create.page'
        )
          .then(
            module =>
              module.WarehouseCreatePage
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
          'warehouses.update'
      },

      loadComponent: () =>
        import(
          './pages/warehouse-edit/warehouse-edit.page'
        )
          .then(
            module =>
              module.WarehouseEditPage
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
          'warehouses.view'
      },

      loadComponent: () =>
        import(
          './pages/warehouse-detail/warehouse-detail.page'
        )
          .then(
            module =>
              module.WarehouseDetailPage
          )
    }
  ];
