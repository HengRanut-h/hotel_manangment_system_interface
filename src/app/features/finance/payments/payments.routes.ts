import {
  Routes
} from '@angular/router';

export const paymentRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent:
      () =>
        import(
          './pages/payments-list/payments-list.page'
        )
          .then(
            module =>
              module.PaymentsListPage
          )
  },

  {
    path:
      'analytics',

    loadComponent:
      () =>
        import(
          './pages/payments-analytics/payments-analytics.page'
        )
          .then(
            module =>
              module.PaymentsAnalyticsPage
          )
  },

  {
    path:
      ':id',

    loadComponent:
      () =>
        import(
          './pages/payments-detail/payments-detail.page'
        )
          .then(
            module =>
              module.PaymentsDetailPage
          )
  }
];
