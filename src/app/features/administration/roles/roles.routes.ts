import {
  Routes
} from '@angular/router';

export const roleRoutes:
  Routes =
[
  {
    path:
      '',

    pathMatch:
      'full',

    loadComponent:
      () =>
        import(
          './pages/role-list/role-list.page'
        )
          .then(
            module =>
              module.RoleListPage
          )
  },

  {
    path:
      'create',

    loadComponent:
      () =>
        import(
          './pages/role-create/role-create.page'
        )
          .then(
            module =>
              module.RoleCreatePage
          )
  },

  {
    path:
      ':id/edit',

    loadComponent:
      () =>
        import(
          './pages/role-edit/role-edit.page'
        )
          .then(
            module =>
              module.RoleEditPage
          )
  },

  {
    path:
      ':id/permissions',

    loadComponent:
      () =>
        import(
          './pages/role-permissions/role-permissions.page'
        )
          .then(
            module =>
              module.RolePermissionsPage
          )
  },

  {
    path:
      ':id',

    loadComponent:
      () =>
        import(
          './pages/role-detail/role-detail.page'
        )
          .then(
            module =>
              module.RoleDetailPage
          )
  }
];
