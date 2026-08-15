import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const laundryRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'laundry.view'
      },

      loadComponent: () =>
        import(
          './pages/laundry-list/laundry-list.page'
        )
          .then(
            module =>
              module.LaundryListPage
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
          'laundry.create'
      },

      loadComponent: () =>
        import(
          './pages/laundry-create/laundry-create.page'
        )
          .then(
            module =>
              module.LaundryCreatePage
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
          'laundry.update'
      },

      loadComponent: () =>
        import(
          './pages/laundry-edit/laundry-edit.page'
        )
          .then(
            module =>
              module.LaundryEditPage
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
          'laundry.view'
      },

      loadComponent: () =>
        import(
          './pages/laundry-detail/laundry-detail.page'
        )
          .then(
            module =>
              module.LaundryDetailPage
          )
    }
  ];
