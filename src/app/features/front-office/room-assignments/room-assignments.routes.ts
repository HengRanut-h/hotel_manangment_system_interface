import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const roomAssignmentsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'room-assignments.view'
      },

      loadComponent: () =>
        import(
          './pages/room-assignments-list/room-assignments-list.page'
        )
          .then(
            module =>
              module.RoomAssignmentsListPage
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
          'room-assignments.create'
      },

      loadComponent: () =>
        import(
          './pages/room-assignments-create/room-assignments-create.page'
        )
          .then(
            module =>
              module.RoomAssignmentsCreatePage
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
          'room-assignments.update'
      },

      loadComponent: () =>
        import(
          './pages/room-assignments-edit/room-assignments-edit.page'
        )
          .then(
            module =>
              module.RoomAssignmentsEditPage
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
          'room-assignments.view'
      },

      loadComponent: () =>
        import(
          './pages/room-assignments-detail/room-assignments-detail.page'
        )
          .then(
            module =>
              module.RoomAssignmentsDetailPage
          )
    }
  ];
