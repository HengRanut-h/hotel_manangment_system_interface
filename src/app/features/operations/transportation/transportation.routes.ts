import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const transportationRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'transportation.view'
      },

      loadComponent: () =>
        import(
          './pages/transportation-list/transportation-list.page'
        )
          .then(
            module =>
              module.TransportationListPage
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
          'transportation.create'
      },

      loadComponent: () =>
        import(
          './pages/transportation-create/transportation-create.page'
        )
          .then(
            module =>
              module.TransportationCreatePage
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
          'transportation.update'
      },

      loadComponent: () =>
        import(
          './pages/transportation-edit/transportation-edit.page'
        )
          .then(
            module =>
              module.TransportationEditPage
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
          'transportation.view'
      },

      loadComponent: () =>
        import(
          './pages/transportation-detail/transportation-detail.page'
        )
          .then(
            module =>
              module.TransportationDetailPage
          )
    }
  ];
