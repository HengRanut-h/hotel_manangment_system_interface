import {
  Routes
} from '@angular/router';

export const notificationRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/notifications-list/notifications-list.page'
      )
        .then(
          module =>
            module.NotificationsListPage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/notifications-analytics/notifications-analytics.page'
      )
        .then(
          module =>
            module.NotificationsAnalyticsPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/notifications-detail/notifications-detail.page'
      )
        .then(
          module =>
            module.NotificationsDetailPage
        )
  }
];
