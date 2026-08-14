import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const roomRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/room-list/room-list.page'
      ).then(
        module =>
          module.RoomListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rooms.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/room-create/room-create.page'
      ).then(
        module =>
          module.RoomCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rooms.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/room-edit/room-edit.page'
      ).then(
        module =>
          module.RoomEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rooms.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/room-detail/room-detail.page'
      ).then(
        module =>
          module.RoomDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'rooms.view'
    }
  }
];
