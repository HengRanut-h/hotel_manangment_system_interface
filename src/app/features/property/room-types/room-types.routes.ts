import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const roomTypeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/room-type-list/room-type-list.page'
      ).then(
        module =>
          module.RoomTypeListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'room-types.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/room-type-create/room-type-create.page'
      ).then(
        module =>
          module.RoomTypeCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'room-types.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/room-type-edit/room-type-edit.page'
      ).then(
        module =>
          module.RoomTypeEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'room-types.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/room-type-detail/room-type-detail.page'
      ).then(
        module =>
          module.RoomTypeDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'room-types.view'
    }
  }
];
