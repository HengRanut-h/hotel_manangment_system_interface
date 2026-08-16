import {
  Routes
} from '@angular/router';

export const taxRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/taxes-list/taxes-list.page'
      )
        .then(
          module =>
            module.TaxesListPage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/taxes-create/taxes-create.page'
      )
        .then(
          module =>
            module.TaxesCreatePage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/taxes-analytics/taxes-analytics.page'
      )
        .then(
          module =>
            module.TaxesAnalyticsPage
        )
  },

  {
    path:
      ':id/edit',

    loadComponent: () =>
      import(
        './pages/taxes-edit/taxes-edit.page'
      )
        .then(
          module =>
            module.TaxesEditPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/taxes-detail/taxes-detail.page'
      )
        .then(
          module =>
            module.TaxesDetailPage
        )
  }
];
