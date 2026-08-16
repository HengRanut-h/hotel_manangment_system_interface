import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const foliosRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'folios.view'
      },

      loadComponent: () =>
        import(
          './pages/folios-workspace/folios-workspace.page'
        )
          .then(
            module =>
              module.FoliosWorkspacePage
          )
    },

    {
      path: 'create',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'folios.create'
      },

      loadComponent: () =>
        import(
          './pages/folios-create/folios-create.page'
        )
          .then(
            module =>
              module.FoliosCreatePage
          )
    },

    {
      path: ':id',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'folios.view'
      },

      loadComponent: () =>
        import(
          './pages/folios-detail/folios-detail.page'
        )
          .then(
            module =>
              module.FoliosDetailPage
          )
    }

  ];
