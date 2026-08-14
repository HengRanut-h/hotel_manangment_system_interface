import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const floorRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/floor-list/floor-list.page'
      ).then(
        module =>
          module.FloorListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'floors.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/floor-create/floor-create.page'
      ).then(
        module =>
          module.FloorCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'floors.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/floor-edit/floor-edit.page'
      ).then(
        module =>
          module.FloorEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'floors.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/floor-detail/floor-detail.page'
      ).then(
        module =>
          module.FloorDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'floors.view'
    }
  }
];
