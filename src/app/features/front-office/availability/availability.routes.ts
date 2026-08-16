import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const availabilityRoutes: Routes = [
  {
    path: '',
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'availability.view'
    },
    loadComponent: () =>
      import(
        './pages/availability-page/availability-page.page'
      )
        .then(
          module =>
            module.AvailabilityPage
        )
  }
];
