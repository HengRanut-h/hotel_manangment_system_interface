import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/employee-list/employee-list.page'
      ).then(
        module =>
          module.EmployeeListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'employees.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/employee-create/employee-create.page'
      ).then(
        module =>
          module.EmployeeCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'employees.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/employee-edit/employee-edit.page'
      ).then(
        module =>
          module.EmployeeEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'employees.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/employee-detail/employee-detail.page'
      ).then(
        module =>
          module.EmployeeDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'employees.view'
    }
  }
];
