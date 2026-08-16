import {
  Routes
} from '@angular/router';

export const reportsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/reports-list/reports-list.page'
      )
        .then(
          module =>
            module.ReportsListPage
        )
  },

  {
    path:
      'history',

    loadComponent: () =>
      import(
        './pages/report-history/report-history.page'
      )
        .then(
          module =>
            module.ReportHistoryPage
        )
  },

  {
    path:
      'history/:runId',

    loadComponent: () =>
      import(
        './pages/report-run-detail/report-run-detail.page'
      )
        .then(
          module =>
            module.ReportRunDetailPage
        )
  },

  {
    path:
      ':id/run',

    loadComponent: () =>
      import(
        './pages/reports-run/reports-run.page'
      )
        .then(
          module =>
            module.ReportsRunPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/reports-detail/reports-detail.page'
      )
        .then(
          module =>
            module.ReportsDetailPage
        )
  }
];
