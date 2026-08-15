import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const complaintsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'complaints.view'
      },

      loadComponent: () =>
        import(
          './pages/complaints-list/complaints-list.page'
        )
          .then(
            module =>
              module.ComplaintsListPage
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
          'complaints.create'
      },

      loadComponent: () =>
        import(
          './pages/complaints-create/complaints-create.page'
        )
          .then(
            module =>
              module.ComplaintsCreatePage
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
          'complaints.update'
      },

      loadComponent: () =>
        import(
          './pages/complaints-edit/complaints-edit.page'
        )
          .then(
            module =>
              module.ComplaintsEditPage
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
          'complaints.view'
      },

      loadComponent: () =>
        import(
          './pages/complaints-detail/complaints-detail.page'
        )
          .then(
            module =>
              module.ComplaintsDetailPage
          )
    }
  ];
