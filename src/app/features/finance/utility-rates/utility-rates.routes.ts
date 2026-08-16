import {
  Routes
} from '@angular/router';

export const utilityRatesRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/utility-rates-list/utility-rates-list.page'
      )
        .then(
          module =>
            module.UtilityRatesListPage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/utility-rates-create/utility-rates-create.page'
      )
        .then(
          module =>
            module.UtilityRatesCreatePage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/utility-rates-analytics/utility-rates-analytics.page'
      )
        .then(
          module =>
            module.UtilityRatesAnalyticsPage
        )
  },

  {
    path:
      ':id/edit',

    loadComponent: () =>
      import(
        './pages/utility-rates-edit/utility-rates-edit.page'
      )
        .then(
          module =>
            module.UtilityRatesEditPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/utility-rates-detail/utility-rates-detail.page'
      )
        .then(
          module =>
            module.UtilityRatesDetailPage
        )
  }
];
