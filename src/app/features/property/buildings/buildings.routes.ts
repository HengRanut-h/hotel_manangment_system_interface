import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const buildingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/building-list/building-list.page'
      ).then(
        module =>
          module.BuildingListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'buildings.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/building-create/building-create.page'
      ).then(
        module =>
          module.BuildingCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'buildings.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/building-edit/building-edit.page'
      ).then(
        module =>
          module.BuildingEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'buildings.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/building-detail/building-detail.page'
      ).then(
        module =>
          module.BuildingDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'buildings.view'
    }
  }
];
