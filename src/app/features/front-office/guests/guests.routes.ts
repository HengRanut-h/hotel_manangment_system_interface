import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const guestsRoutes:
  Routes = [

    {
      path: '',
      canActivate: [
        permissionGuard
      ],
      data: {
        permission:
          'guests.view'
      },
      loadComponent: () =>
        import(
          './pages/guests-list/guests-list.page'
        )
          .then(
            module =>
              module.GuestsListPage
          )
    },

    {
      path: 'create',
      canActivate: [
        permissionGuard
      ],
      data: {
        permission:
          'guests.create'
      },
      loadComponent: () =>
        import(
          './pages/guest-create/guest-create.page'
        )
          .then(
            module =>
              module.GuestCreatePage
          )
    },

    {
      path: ':id/edit',
      canActivate: [
        permissionGuard
      ],
      data: {
        permission:
          'guests.update'
      },
      loadComponent: () =>
        import(
          './pages/guest-edit/guest-edit.page'
        )
          .then(
            module =>
              module.GuestEditPage
          )
    },

    {
      path: ':id',
      canActivate: [
        permissionGuard
      ],
      data: {
        permission:
          'guests.view'
      },
      loadComponent: () =>
        import(
          './pages/guest-detail/guest-detail.page'
        )
          .then(
            module =>
              module.GuestDetailPage
          )
    }
  ];
