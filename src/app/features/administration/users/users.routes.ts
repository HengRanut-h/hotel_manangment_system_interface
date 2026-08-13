import {
  Routes
} from '@angular/router';

export const userRoutes:
  Routes =
[
  {
    path: '',
    pathMatch: 'full',

    loadComponent: () =>
      import(
        './pages/user-list/user-list.page'
      )
        .then(
          module =>
            module.UserListPage
        )
  },

  {
    path: 'create',

    loadComponent: () =>
      import(
        './pages/user-create/user-create.page'
      )
        .then(
          module =>
            module.UserCreatePage
        )
  },

  {
    path: ':id/edit',

    loadComponent: () =>
      import(
        './pages/user-edit/user-edit.page'
      )
        .then(
          module =>
            module.UserEditPage
        )
  },

  {
    path: ':id/roles',

    loadComponent: () =>
      import(
        './pages/user-roles/user-roles.page'
      )
        .then(
          module =>
            module.UserRolesPage
        )
  },

  {
    path: ':id/reset-password',

    loadComponent: () =>
      import(
        './pages/user-reset-password/user-reset-password.page'
      )
        .then(
          module =>
            module.UserResetPasswordPage
        )
  },

  {
    path: ':id',

    loadComponent: () =>
      import(
        './pages/user-detail/user-detail.page'
      )
        .then(
          module =>
            module.UserDetailPage
        )
  }
];
