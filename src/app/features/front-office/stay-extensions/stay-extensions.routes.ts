import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const stayExtensionsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'stay-extensions.view'
      },

      loadComponent: () =>
        import(
          './pages/stay-extensions-list/stay-extensions-list.page'
        )
          .then(
            module =>
              module.StayExtensionsListPage
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
          'stay-extensions.create'
      },

      loadComponent: () =>
        import(
          './pages/stay-extensions-create/stay-extensions-create.page'
        )
          .then(
            module =>
              module.StayExtensionsCreatePage
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
          'stay-extensions.update'
      },

      loadComponent: () =>
        import(
          './pages/stay-extensions-edit/stay-extensions-edit.page'
        )
          .then(
            module =>
              module.StayExtensionsEditPage
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
          'stay-extensions.view'
      },

      loadComponent: () =>
        import(
          './pages/stay-extensions-detail/stay-extensions-detail.page'
        )
          .then(
            module =>
              module.StayExtensionsDetailPage
          )
    }
  ];
