import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const checkInsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'check-ins.view'
      },

      loadComponent: () =>
        import(
          './pages/check-ins-list/check-ins-list.page'
        )
          .then(
            module =>
              module.CheckInsListPage
          )
    }
  ];
