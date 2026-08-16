import {
  Routes
} from '@angular/router';

export const utilityMetersRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/utility-meters-list/utility-meters-list.page'
      )
        .then(
          module =>
            module.UtilityMetersListPage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/utility-meters-create/utility-meters-create.page'
      )
        .then(
          module =>
            module.UtilityMetersCreatePage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/utility-meters-analytics/utility-meters-analytics.page'
      )
        .then(
          module =>
            module.UtilityMetersAnalyticsPage
        )
  },

  {
    path:
      ':id/edit',

    loadComponent: () =>
      import(
        './pages/utility-meters-edit/utility-meters-edit.page'
      )
        .then(
          module =>
            module.UtilityMetersEditPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/utility-meters-detail/utility-meters-detail.page'
      )
        .then(
          module =>
            module.UtilityMetersDetailPage
        )
  }
];
