import {
  Routes
} from '@angular/router';

export const settingsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/settings-list/settings-list.page'
      )
        .then(
          module =>
            module.SettingsListPage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/settings-create/settings-create.page'
      )
        .then(
          module =>
            module.SettingsCreatePage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/settings-analytics/settings-analytics.page'
      )
        .then(
          module =>
            module.SettingsAnalyticsPage
        )
  },

  {
    path:
      ':id/edit',

    loadComponent: () =>
      import(
        './pages/settings-edit/settings-edit.page'
      )
        .then(
          module =>
            module.SettingsEditPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/settings-detail/settings-detail.page'
      )
        .then(
          module =>
            module.SettingsDetailPage
        )
  }
];
