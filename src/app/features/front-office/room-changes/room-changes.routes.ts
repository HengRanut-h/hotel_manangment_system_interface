import {
  Routes
} from '@angular/router';

export const roomChangesRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent:
      () =>
        import(
          './pages/room-change-list/room-change-list.page'
        )
          .then(
            module =>
              module.RoomChangeListPage
          )
  },

  {
    path:
      'analytics',

    loadComponent:
      () =>
        import(
          './pages/room-change-analytics/room-change-analytics.page'
        )
          .then(
            module =>
              module.RoomChangeAnalyticsPage
          )
  },

  {
    path:
      ':id',

    loadComponent:
      () =>
        import(
          './pages/room-change-detail/room-change-detail.page'
        )
          .then(
            module =>
              module.RoomChangeDetailPage
          )
  }
];
