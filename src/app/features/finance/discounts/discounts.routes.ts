import {
  Routes
} from '@angular/router';

export const discountsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/discounts-list/discounts-list.page'
      )
        .then(
          module =>
            module.DiscountsListPage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/discounts-create/discounts-create.page'
      )
        .then(
          module =>
            module.DiscountsCreatePage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/discounts-analytics/discounts-analytics.page'
      )
        .then(
          module =>
            module.DiscountsAnalyticsPage
        )
  },

  {
    path:
      ':id/edit',

    loadComponent: () =>
      import(
        './pages/discounts-edit/discounts-edit.page'
      )
        .then(
          module =>
            module.DiscountsEditPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/discounts-detail/discounts-detail.page'
      )
        .then(
          module =>
            module.DiscountsDetailPage
        )
  }
];
