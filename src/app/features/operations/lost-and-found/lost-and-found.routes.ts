import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const lostAndFoundRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'lost-and-found.view'
      },

      loadComponent: () =>
        import(
          './pages/lost-and-found-list/lost-and-found-list.page'
        )
          .then(
            module =>
              module.LostAndFoundListPage
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
          'lost-and-found.create'
      },

      loadComponent: () =>
        import(
          './pages/lost-and-found-create/lost-and-found-create.page'
        )
          .then(
            module =>
              module.LostAndFoundCreatePage
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
          'lost-and-found.update'
      },

      loadComponent: () =>
        import(
          './pages/lost-and-found-edit/lost-and-found-edit.page'
        )
          .then(
            module =>
              module.LostAndFoundEditPage
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
          'lost-and-found.view'
      },

      loadComponent: () =>
        import(
          './pages/lost-and-found-detail/lost-and-found-detail.page'
        )
          .then(
            module =>
              module.LostAndFoundDetailPage
          )
    }
  ];
