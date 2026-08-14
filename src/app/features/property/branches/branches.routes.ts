import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const branchRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/branch-list/branch-list.page'
      ).then(
        module =>
          module.BranchListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'branches.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/branch-create/branch-create.page'
      ).then(
        module =>
          module.BranchCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'branches.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/branch-edit/branch-edit.page'
      ).then(
        module =>
          module.BranchEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'branches.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/branch-detail/branch-detail.page'
      ).then(
        module =>
          module.BranchDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'branches.view'
    }
  }
];
