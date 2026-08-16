import {
  Routes
} from '@angular/router';

export const foliosRoutes:
  Routes =
[
  {
    path:
      '',
    loadComponent: () =>
      import(
        './pages/folios-home/folios-home.page'
      )
        .then(
          module =>
            module.FoliosHomePage
        )
  },

  {
    path:
      'create',
    loadComponent: () =>
      import(
        './pages/folios-create/folios-create.page'
      )
        .then(
          module =>
            module.FoliosCreatePage
        )
  },

  {
    path:
      ':id',
    loadComponent: () =>
      import(
        './pages/folios-detail/folios-detail.page'
      )
        .then(
          module =>
            module.FoliosDetailPage
        )
  }
];
