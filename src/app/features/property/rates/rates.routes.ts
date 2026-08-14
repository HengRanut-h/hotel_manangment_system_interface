import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const rateRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/rate-list/rate-list.page'
      ).then(
        module =>
          module.RateListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rates.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/rate-create/rate-create.page'
      ).then(
        module =>
          module.RateCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rates.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/rate-edit/rate-edit.page'
      ).then(
        module =>
          module.RateEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rates.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/rate-detail/rate-detail.page'
      ).then(
        module =>
          module.RateDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rates.view'
    }
  }
];
