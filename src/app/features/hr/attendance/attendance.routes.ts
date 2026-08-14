import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const attendanceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/attendance-list/attendance-list.page'
      ).then(
        module =>
          module.AttendanceListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'attendance.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/attendance-create/attendance-create.page'
      ).then(
        module =>
          module.AttendanceCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'attendance.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/attendance-edit/attendance-edit.page'
      ).then(
        module =>
          module.AttendanceEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'attendance.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/attendance-detail/attendance-detail.page'
      ).then(
        module =>
          module.AttendanceDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'attendance.view'
    }
  }
];
