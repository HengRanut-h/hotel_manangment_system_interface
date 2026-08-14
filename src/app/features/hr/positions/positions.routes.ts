import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const positionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/position-list/position-list.page'
      ).then(
        module =>
          module.PositionListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'positions.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/position-create/position-create.page'
      ).then(
        module =>
          module.PositionCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'positions.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/position-edit/position-edit.page'
      ).then(
        module =>
          module.PositionEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'positions.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/position-detail/position-detail.page'
      ).then(
        module =>
          module.PositionDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'positions.view'
    }
  }
];
