import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const maintenanceRoutes: Routes = [
  {
    path: '',
    loadComponent:
      () =>
        import(
          './pages/maintenance-list/maintenance-list.page'
        ).then(
          m =>
            m.MaintenanceListPage
        ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission:
        'maintenance.view'
    }
  }
];
