import {
  Routes
} from '@angular/router';

export const meterReadingsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/meter-readings-list/meter-readings-list.page'
      )
        .then(
          module =>
            module.MeterReadingsListPage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/meter-readings-create/meter-readings-create.page'
      )
        .then(
          module =>
            module.MeterReadingsCreatePage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/meter-readings-analytics/meter-readings-analytics.page'
      )
        .then(
          module =>
            module.MeterReadingsAnalyticsPage
        )
  },

  {
    path:
      ':id/edit',

    loadComponent: () =>
      import(
        './pages/meter-readings-edit/meter-readings-edit.page'
      )
        .then(
          module =>
            module.MeterReadingsEditPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/meter-readings-detail/meter-readings-detail.page'
      )
        .then(
          module =>
            module.MeterReadingsDetailPage
        )
  }
];
