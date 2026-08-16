import {
  Routes
} from '@angular/router';

export const refundRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent:
      () =>
        import(
          './pages/refunds-list/refunds-list.page'
        )
          .then(
            module =>
              module.RefundsListPage
          )
  },

  {
    path:
      'analytics',

    loadComponent:
      () =>
        import(
          './pages/refunds-analytics/refunds-analytics.page'
        )
          .then(
            module =>
              module.RefundsAnalyticsPage
          )
  },

  {
    path:
      ':id',

    loadComponent:
      () =>
        import(
          './pages/refunds-detail/refunds-detail.page'
        )
          .then(
            module =>
              module.RefundsDetailPage
          )
  }
];
