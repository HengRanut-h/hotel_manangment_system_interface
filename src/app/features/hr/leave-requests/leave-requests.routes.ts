import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const leaveRequestRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/leave-request-list/leave-request-list.page'
      ).then(
        module =>
          module.LeaveRequestListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'leave-requests.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/leave-request-create/leave-request-create.page'
      ).then(
        module =>
          module.LeaveRequestCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'leave-requests.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/leave-request-edit/leave-request-edit.page'
      ).then(
        module =>
          module.LeaveRequestEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'leave-requests.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/leave-request-detail/leave-request-detail.page'
      ).then(
        module =>
          module.LeaveRequestDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'leave-requests.view'
    }
  }
];
