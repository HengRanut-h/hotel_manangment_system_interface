import {
  Routes
} from '@angular/router';

export const depositRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent:
      () =>
        import(
          './pages/deposits-list/deposits-list.page'
        )
          .then(
            module =>
              module.DepositsListPage
          )
  },

  {
    path:
      'analytics',

    loadComponent:
      () =>
        import(
          './pages/deposits-analytics/deposits-analytics.page'
        )
          .then(
            module =>
              module.DepositsAnalyticsPage
          )
  },

  {
    path:
      ':id',

    loadComponent:
      () =>
        import(
          './pages/deposits-detail/deposits-detail.page'
        )
          .then(
            module =>
              module.DepositsDetailPage
          )
  }
];
