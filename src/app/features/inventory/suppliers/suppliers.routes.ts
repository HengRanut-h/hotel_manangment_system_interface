import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const suppliersRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'suppliers.view'
      },

      loadComponent: () =>
        import(
          './pages/suppliers-list/suppliers-list.page'
        )
          .then(
            module =>
              module.SuppliersListPage
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
          'suppliers.create'
      },

      loadComponent: () =>
        import(
          './pages/supplier-create/supplier-create.page'
        )
          .then(
            module =>
              module.SupplierCreatePage
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
          'suppliers.update'
      },

      loadComponent: () =>
        import(
          './pages/supplier-edit/supplier-edit.page'
        )
          .then(
            module =>
              module.SupplierEditPage
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
          'suppliers.view'
      },

      loadComponent: () =>
        import(
          './pages/supplier-detail/supplier-detail.page'
        )
          .then(
            module =>
              module.SupplierDetailPage
          )
    }
  ];
