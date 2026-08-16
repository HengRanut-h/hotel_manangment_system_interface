import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const reservationsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'reservations.view'
      },

      loadComponent: () =>
        import(
          './pages/reservations-list/reservations-list.page'
        )
          .then(
            module =>
              module.ReservationsListPage
          )
    },

    {
      path: 'create',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'reservations.create'
      },

      loadComponent: () =>
        import(
          './pages/reservation-create/reservation-create.page'
        )
          .then(
            module =>
              module.ReservationCreatePage
          )
    },

    {
      path: ':id',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'reservations.view'
      },

      loadComponent: () =>
        import(
          './pages/reservation-detail/reservation-detail.page'
        )
          .then(
            module =>
              module.ReservationDetailPage
          )
    }
  ];
