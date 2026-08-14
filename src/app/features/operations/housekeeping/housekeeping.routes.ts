import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const housekeepingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/housekeeping-list/housekeeping-list.page'
      ).then(
        module =>
          module.HousekeepingListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'housekeeping.view'
    }
  }
];
