import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const securityIncidentsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'security-incidents.view'
      },

      loadComponent: () =>
        import(
          './pages/security-incidents-list/security-incidents-list.page'
        )
          .then(
            module =>
              module.SecurityIncidentsListPage
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
          'security-incidents.create'
      },

      loadComponent: () =>
        import(
          './pages/security-incidents-create/security-incidents-create.page'
        )
          .then(
            module =>
              module.SecurityIncidentsCreatePage
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
          'security-incidents.update'
      },

      loadComponent: () =>
        import(
          './pages/security-incidents-edit/security-incidents-edit.page'
        )
          .then(
            module =>
              module.SecurityIncidentsEditPage
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
          'security-incidents.view'
      },

      loadComponent: () =>
        import(
          './pages/security-incidents-detail/security-incidents-detail.page'
        )
          .then(
            module =>
              module.SecurityIncidentsDetailPage
          )
    }
  ];
