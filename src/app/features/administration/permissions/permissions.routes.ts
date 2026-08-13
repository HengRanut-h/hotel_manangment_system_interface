import {
  Routes
} from '@angular/router';

export const PERMISSION_ROUTES:
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
          './pages/permission-list/permission-list.page'
        )
          .then(
            module =>
              module.PermissionListPage
          )
  },

  {
    path:
      'create',

    loadComponent:
      () =>
        import(
          './pages/permission-create/permission-create.page'
        )
          .then(
            module =>
              module.PermissionCreatePage
          )
  },

  {
    path:
      ':id/edit',

    loadComponent:
      () =>
        import(
          './pages/permission-edit/permission-edit.page'
        )
          .then(
            module =>
              module.PermissionEditPage
          )
  }
];
