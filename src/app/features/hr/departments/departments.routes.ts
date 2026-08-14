import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const departmentRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/department-list/department-list.page'
      ).then(
        module =>
          module.DepartmentListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'departments.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/department-create/department-create.page'
      ).then(
        module =>
          module.DepartmentCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'departments.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/department-edit/department-edit.page'
      ).then(
        module =>
          module.DepartmentEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'departments.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/department-detail/department-detail.page'
      ).then(
        module =>
          module.DepartmentDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'departments.view'
    }
  }
];
