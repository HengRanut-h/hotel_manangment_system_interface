import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const guestRequestsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'guest-requests.view'
      },

      loadComponent: () =>
        import(
          './pages/guest-requests-list/guest-requests-list.page'
        )
          .then(
            module =>
              module.GuestRequestsListPage
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
          'guest-requests.create'
      },

      loadComponent: () =>
        import(
          './pages/guest-requests-create/guest-requests-create.page'
        )
          .then(
            module =>
              module.GuestRequestsCreatePage
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
          'guest-requests.update'
      },

      loadComponent: () =>
        import(
          './pages/guest-requests-edit/guest-requests-edit.page'
        )
          .then(
            module =>
              module.GuestRequestsEditPage
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
          'guest-requests.view'
      },

      loadComponent: () =>
        import(
          './pages/guest-requests-detail/guest-requests-detail.page'
        )
          .then(
            module =>
              module.GuestRequestsDetailPage
          )
    }
  ];
