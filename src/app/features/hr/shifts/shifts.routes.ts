import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const shiftRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/shift-list/shift-list.page'
      ).then(
        module =>
          module.ShiftListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'shifts.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/shift-create/shift-create.page'
      ).then(
        module =>
          module.ShiftCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'shifts.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/shift-edit/shift-edit.page'
      ).then(
        module =>
          module.ShiftEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'shifts.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/shift-detail/shift-detail.page'
      ).then(
        module =>
          module.ShiftDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'shifts.view'
    }
  }
];
